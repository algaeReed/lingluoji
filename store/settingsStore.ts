// store/settingsStore.ts
import { UsageTimeType } from "@/utils/getUsageTimeDescription";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 主题模式联合类型，表示应用支持的主题风格
export type ThemeMode = "light" | "dark" | "blue" | "green";

// 布局模式联合类型，表示应用支持的页面布局样式
export type LayoutMode = "card" | "singleColumn" | "doubleColumn";

// 主题选项类型，用于 UI 上展示给用户选择
export interface ThemeOption {
  label: string; // 显示的文字
  value: ThemeMode; // 主题值
}

// 设置仓库状态接口，定义所有需要全局管理的状态及其修改方法
interface SettingsStore {
  // 当前主题模式
  themeMode: ThemeMode;
  // 设置主题模式的方法
  setThemeMode: (mode: ThemeMode) => void;

  // 当前布局模式
  layoutMode: LayoutMode;
  // 设置布局模式的方法
  setLayoutMode: (mode: LayoutMode) => void;

  // 主题选项列表，供 UI 选择
  themeOptions: ThemeOption[];
  // 设置主题选项列表的方法（一般初始化即可）
  setThemeOptions: (options: ThemeOption[]) => void;

  // 是否显示底部导航栏
  showTabBar: boolean;
  // 设置底部导航栏显示状态的方法
  setShowTabBar: (visible: boolean) => void;

  // Usage 时间描述是否使用简写格式，例如 1y 2m
  isShort: boolean;
  // 设置是否使用简写格式
  setIsShort: (value: boolean) => void;

  // Usage 时间描述强制类型，undefined 表示自动判断
  forceType: UsageTimeType | undefined;
  // 设置强制类型
  setForceType: (value: UsageTimeType | undefined) => void;
}

// 创建 zustand store 并持久化到 AsyncStorage 中，数据将保存在本地存储
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // 主题初始值为浅色模式
      themeMode: "light",
      setThemeMode: (mode) => set({ themeMode: mode }),

      // 布局初始值为卡片布局
      layoutMode: "card",
      setLayoutMode: (mode) => set({ layoutMode: mode }),

      // 主题选项初始化列表，支持四种主题
      themeOptions: [
        { label: "浅色 Light", value: "light" },
        { label: "深色 Dark", value: "dark" },
        { label: "蓝色 Blue", value: "blue" },
        { label: "绿色 Green", value: "green" },
      ],
      setThemeOptions: (options) => set({ themeOptions: options }),

      // 底部导航栏默认显示
      showTabBar: true,
      setShowTabBar: (visible) => set({ showTabBar: visible }),

      // Usage 时间简写格式默认关闭
      isShort: false,
      setIsShort: (value) => set({ isShort: value }),

      // Usage 时间强制类型默认自动判断（undefined）
      forceType: undefined,
      setForceType: (value) => set({ forceType: value }),
    }),
    {
      // 本地存储的 key 名称
      name: "settings-storage",
      // 使用 AsyncStorage 作为存储介质，支持 JSON 序列化
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
