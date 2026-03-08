import { create } from "zustand";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";
import gallery9 from "@/assets/gallery-9.jpg";

export interface GalleryItem {
  id: string;
  src: string;
  prompt: string;
  isFree: boolean;
}

interface GalleryStore {
  items: GalleryItem[];
  addItem: (item: Omit<GalleryItem, "id">) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<Omit<GalleryItem, "id">>) => void;
}

const initialItems: GalleryItem[] = [
  {
    id: "1",
    src: gallery1,
    prompt: "A stylish young man in a designer white sweatshirt standing in front of an orange BMW sports car at night, urban street photography, high fashion editorial style, moody lighting",
    isFree: true,
  },
  {
    id: "2",
    src: gallery2,
    prompt: "A stylish man in a black Lanvin hoodie leaning against a red luxury sports car in a garage, fashion editorial photography, cinematic lighting",
    isFree: true,
  },
  {
    id: "3",
    src: gallery3,
    prompt: "A fashionable man in a black puffer jacket and beanie sitting in a luxury car interior at night, wearing sunglasses, street style photography, moody dark tones",
    isFree: false,
  },
  {
    id: "4",
    src: gallery4,
    prompt: "A stylish man in a navy beanie and black puffer jacket walking on a European city street at night, fashion editorial street photography, cinematic urban lighting",
    isFree: false,
  },
  {
    id: "5",
    src: gallery5,
    prompt: "A man in a blue polo shirt with sunglasses standing by Italian lakeside architecture, Lake Como vibes, warm golden hour light, fashion editorial photography",
    isFree: false,
  },
  {
    id: "6",
    src: gallery6,
    prompt: "A stylish man in a glossy black puffer jacket looking over his shoulder on a city street at night, moody fashion photography, dramatic lighting",
    isFree: false,
  },
  {
    id: "7",
    src: gallery7,
    prompt: "A fashionable man in a grey overcoat and turtleneck, European architecture background, editorial street style photography, soft natural lighting",
    isFree: false,
  },
  {
    id: "8",
    src: gallery8,
    prompt: "A man in a tan trench coat and white sneakers walking through a modern art gallery, high fashion editorial, clean minimalist setting",
    isFree: false,
  },
  {
    id: "9",
    src: gallery9,
    prompt: "A stylish man in a cream knit sweater and gold chain, leaning on a stone wall, Mediterranean setting, warm sunset light, fashion photography",
    isFree: false,
  },
];

export const useGalleryStore = create<GalleryStore>((set) => ({
  items: initialItems,
  addItem: (item) =>
    set((state) => ({
      items: [
        { ...item, id: Date.now().toString() },
        ...state.items,
      ],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
}));
