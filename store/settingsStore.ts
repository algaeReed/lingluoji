// store/settingsStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 主题模式联合类型
export type ThemeMode = "light" | "dark" | "blue" | "green";

// 布局模式联合类型
export type LayoutMode = "card" | "singleColumn" | "doubleColumn";

// 主题选项类型
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
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
