// store/itemsStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { create } from "zustand";

export const STORAGE_KEY = "@items_storage";

export type DailyPrice = {
  date: string;
  price: number;
};

export type Item = {
  id: string;
  name: string;
  price: number;
  purchaseDate: string;
  dailyPrices: DailyPrice[];
  imageUri?: string;
};

type ItemsStore = {
  items: Item[];
  setItems: (items: Item[]) => void;
  loadItems: () => Promise<void>;
  saveItems: () => Promise<void>;
  addItem: (item: Omit<Item, "id" | "dailyPrices">) => void;
  updateItem: (id: string, updated: Partial<Omit<Item, "id" | "dailyPrices">>) => void;
  deleteItem: (id: string) => void;
  clearAllItems: () => void;
  generateTestData: (count: number, onProgress?: (current: number, total: number) => void) => Promise<void>;
};

const generateDailyPrices = (startDateISO: string, totalPrice: number): DailyPrice[] => {
  const startDate = dayjs(startDateISO).startOf("day");
  const endDate = dayjs().startOf("day");
  const daysCount = endDate.diff(startDate, "day") + 1;
  const avg = totalPrice / daysCount;
  return Array.from({ length: daysCount }, (_, i) => ({
    date: startDate.add(i, "day").format("YYYY-MM-DD"),
    price: avg,
  }));
};

export const useItemsStore = create<ItemsStore>((set, get) => ({
  items: [],
  setItems: (newItems: Item[]) => set({ items: newItems }),
  loadItems: async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) set({ items: JSON.parse(json) });
    } catch (e) {
      console.warn("加载失败", e);
    }
  },
  saveItems: async () => {
    try {
      const items = get().items;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("保存失败", e);
    }
  },
  addItem: (data) => {
    const dailyPrices = generateDailyPrices(data.purchaseDate, data.price);
    const newItem: Item = {
      id: Date.now().toString(),
      ...data,
      dailyPrices,
    };
    const newItems = [newItem, ...get().items];
    set({ items: newItems });
    get().saveItems();
  },
  updateItem: (id, updated) => {
    const oldItem = get().items.find((item) => item.id === id);
    if (!oldItem) return;
    const purchaseDate = updated.purchaseDate || oldItem.purchaseDate;
    const price = updated.price ?? oldItem.price;
    const dailyPrices = generateDailyPrices(purchaseDate, price);
    const newItem: Item = {
      ...oldItem,
      ...updated,
      dailyPrices,
      purchaseDate,
      price,
    };
    const newItems = get().items.map((it) => (it.id === id ? newItem : it));
    set({ items: newItems });
    get().saveItems();
  },
  deleteItem: (id) => {
    const newItems = get().items.filter((it) => it.id !== id);
    set({ items: newItems });
    get().saveItems();
  },
  clearAllItems: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ items: [] });
    } catch (e) {
      console.error("清除失败:", e);
      throw e;
    }
  },

  generateTestData: async (count: number, onProgress?: (current: number, total: number) => void) => {
    const items: Item[] = [];

    for (let i = 0; i < count; i++) {
      const price = Math.floor(Math.random() * 1000) + 1;
      const purchaseDate = dayjs()
        .subtract(Math.floor(Math.random() * 30), "day")
        .format("YYYY-MM-DD");

      items.push({
        id: `item-${Date.now()}-${i}`,
        name: `测试物品 ${i + 1}`,
        price,
        purchaseDate,
        dailyPrices: generateDailyPrices(purchaseDate, price),
      });

      if (onProgress && i % 20 === 0) {
        onProgress(i + 1, count);
        await new Promise((res) => setTimeout(res, 0)); // 刷新 UI
      }
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    set({ items });
  },
}));
