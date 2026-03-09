import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryItem {
  id: string;
  src: string;
  prompt: string;
  isFree: boolean;
  sortOrder: number;
  aspectRatio: string;
}

interface GalleryStore {
  items: GalleryItem[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (item: { file?: File; src?: string; prompt: string; isFree: boolean; sortOrder: number }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItem: (id: string, updates: Partial<Omit<GalleryItem, "id">> & { file?: File }) => Promise<void>;
  reorderItems: (reorderedItems: GalleryItem[]) => Promise<void>;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const mapRow = (row: any): GalleryItem => ({
  id: row.id,
  src: row.src,
  prompt: row.prompt,
  isFree: row.is_free,
  sortOrder: row.sort_order,
  aspectRatio: row.aspect_ratio || "original",
});

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  
  const { error } = await supabase.storage
    .from("gallery-images")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  return `${SUPABASE_URL}/storage/v1/object/public/gallery-images/${fileName}`;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  items: [],
  loading: true,

  fetchItems: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      set({ items: data.map(mapRow), loading: false });
    } else {
      set({ loading: false });
    }
  },

  addItem: async (item) => {
    let src = item.src || "";
    
    if (item.file) {
      try {
        src = await uploadImage(item.file);
      } catch (err) {
        console.error("Upload failed:", err);
        return;
      }
    }

    const maxOrder = Math.max(0, ...get().items.map((i) => i.sortOrder));
    const { data, error } = await supabase
      .from("gallery_items")
      .insert({
        src,
        prompt: item.prompt,
        is_free: item.isFree,
        sort_order: maxOrder + 1,
        aspect_ratio: (item as any).aspectRatio || "original",
      })
      .select()
      .single();

    if (!error && data) {
      set((state) => ({ items: [...state.items, mapRow(data)] }));
    }
  },

  removeItem: async (id) => {
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (!error) {
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    }
  },

  updateItem: async (id, updates) => {
    let src = updates.src;

    // Upload new file if provided
    if (updates.file) {
      try {
        src = await uploadImage(updates.file);
      } catch (err) {
        console.error("Upload failed:", err);
        return;
      }
    }

    const dbUpdates: any = {};
    if (src !== undefined) dbUpdates.src = src;
    if (updates.prompt !== undefined) dbUpdates.prompt = updates.prompt;
    if (updates.isFree !== undefined) dbUpdates.is_free = updates.isFree;
    if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

    const { error } = await supabase.from("gallery_items").update(dbUpdates).eq("id", id);
    if (!error) {
      const finalUpdates: Partial<GalleryItem> = { ...updates };
      if (src) finalUpdates.src = src;
      delete (finalUpdates as any).file;
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, ...finalUpdates } : i)),
      }));
    }
  },

  reorderItems: async (reorderedItems) => {
    set({ items: reorderedItems });
    const updates = reorderedItems.map((item, index) =>
      supabase.from("gallery_items").update({ sort_order: index + 1 }).eq("id", item.id)
    );
    await Promise.all(updates);
  },
}));
