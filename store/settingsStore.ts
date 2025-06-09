import AsyncStorage from "@react-native-async-storage/async-storage"; // React Native
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 类型定义
export type LayoutMode = "card" | "singleColumn" | "doubleColumn";
export type ThemeMode = "light" | "dark" | "blue" | "green";

export interface ThemeOption {
  label: string;
  value: ThemeMode;
}

interface SettingsStore {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;

  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;

  themeOptions: ThemeOption[];
  setThemeOptions: (options: ThemeOption[]) => void;

  showTabBar: boolean;
  setShowTabBar: (visible: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      themeMode: "light",
      setThemeMode: (mode) => set({ themeMode: mode }),

      layoutMode: "card",
      setLayoutMode: (mode) => set({ layoutMode: mode }),

      themeOptions: [
        { label: "浅色 Light", value: "light" },
        { label: "深色 Dark", value: "dark" },
        { label: "蓝色 Blue", value: "blue" },
        { label: "绿色 Green", value: "green" },
      ],
      setThemeOptions: (options) => set({ themeOptions: options }),

      showTabBar: true,
      setShowTabBar: (visible) => set({ showTabBar: visible }),
    }),
    {
      name: "settings-storage", // 存储的 key
      storage: createJSONStorage(() => AsyncStorage), // 使用 AsyncStorage（React Native）
    }
  )
);
