import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryItem {
  id: string;
  src: string;
  prompt: string;
  isFree: boolean;
  sortOrder: number;
}

interface GalleryStore {
  items: GalleryItem[];
  loading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<GalleryItem, "id">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItem: (id: string, updates: Partial<Omit<GalleryItem, "id">>) => Promise<void>;
  reorderItems: (reorderedItems: GalleryItem[]) => Promise<void>;
}

const mapRow = (row: any): GalleryItem => ({
  id: row.id,
  src: row.src,
  prompt: row.prompt,
  isFree: row.is_free,
  sortOrder: row.sort_order,
});

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
    const maxOrder = Math.max(0, ...get().items.map((i) => i.sortOrder));
    const { data, error } = await supabase
      .from("gallery_items")
      .insert({
        src: item.src,
        prompt: item.prompt,
        is_free: item.isFree,
        sort_order: maxOrder + 1,
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
    const dbUpdates: any = {};
    if (updates.src !== undefined) dbUpdates.src = updates.src;
    if (updates.prompt !== undefined) dbUpdates.prompt = updates.prompt;
    if (updates.isFree !== undefined) dbUpdates.is_free = updates.isFree;
    if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

    const { error } = await supabase.from("gallery_items").update(dbUpdates).eq("id", id);
    if (!error) {
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      }));
    }
  },

  reorderItems: async (reorderedItems) => {
    set({ items: reorderedItems });
    // Update sort_order in DB
    const updates = reorderedItems.map((item, index) =>
      supabase.from("gallery_items").update({ sort_order: index + 1 }).eq("id", item.id)
    );
    await Promise.all(updates);
  },
}));
