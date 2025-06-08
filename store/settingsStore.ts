import { create } from "zustand";

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

  // 主题选项，放store里
  themeOptions: ThemeOption[];
  setThemeOptions: (options: ThemeOption[]) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
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
}));
