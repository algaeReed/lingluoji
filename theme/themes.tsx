import type { MD3Theme } from "react-native-paper";
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperLightTheme } from "react-native-paper";

/**
 * 通用 Light 基础配置
 */
const baseLight = {
  ...PaperLightTheme,
  roundness: 8,
  colors: {
    ...PaperLightTheme.colors,
    primary: "#4CAF50", // 主要颜色，默认绿色
    onPrimary: "#FFFFFF", // 主要颜色上的内容颜色（文字、图标）
    primaryContainer: "#A4D29F", // 主要容器色
    onPrimaryContainer: "#00391E", // 主要容器上的文字
    secondary: "#03DAC6", // 次要颜色，青色
    onSecondary: "#000000", // 次要颜色文字
    secondaryContainer: "#B7DEC5", // 次要容器色
    onSecondaryContainer: "#00391E", // 次要容器文字
    error: "#B00020", // 错误颜色（红色）
    onError: "#FFFFFF", // 错误颜色上的文字
    background: "#FFFFFF", // 页面背景色，白色
    onBackground: "#000000", // 背景上的内容颜色
    surface: "#F5F5F5", // 表面色，用于卡片、菜单等背景
    onSurface: "#000000", // 表面色上的文字
    surfaceVariant: "#E0E0E0", // 表面变体色，用于区分不同层级
    onSurfaceVariant: "#79747E", // 表面变体色上的文字
    outlineVariant: "#79747E", // 轮廓线颜色，默认灰色，常用于边框或分割线
  },
};

/**
 * 通用 Dark 基础配置
 */
const baseDark = {
  ...PaperDarkTheme,
  roundness: 8,
  colors: {
    ...PaperDarkTheme.colors,
    primary: "#BB86FC", // 主要颜色，紫色
    onPrimary: "#000000", // 主要颜色上的内容颜色（文字、图标）
    primaryContainer: "#4F378B", // 主要容器色
    onPrimaryContainer: "#EADDFF", // 主要容器上的文字
    secondary: "#03DAC6", // 次要颜色，青色
    onSecondary: "#000000", // 次要颜色文字
    secondaryContainer: "#49454F", // 次要容器色
    onSecondaryContainer: "#CAC4D0", // 次要容器文字
    error: "#CF6679", // 错误颜色（红色）
    onError: "#000000", // 错误颜色上的文字
    background: "#121212", // 页面背景色，深黑色
    onBackground: "#FFFFFF", // 背景上的内容颜色
    surface: "#1F1F1F", // 表面色，用于卡片、菜单等背景
    onSurface: "#FFFFFF", // 表面色上的文字
    surfaceVariant: "#2C2C2C", // 表面变体色
    onSurfaceVariant: "#CAC4D0", // 表面变体上的内容颜色，高对比度灰色
    outlineVariant: "#938F99", // 轮廓线颜色，灰紫色
  },
};

/**
 * Light Theme（紫色调优化版）
 */
export const LightTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#6750A4", // 主要颜色，深紫色
    onPrimary: "#FFFFFF",
    primaryContainer: "#EADDFF",
    onPrimaryContainer: "#21005D",
    secondary: "#625B71",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E8DEF8",
    onSecondaryContainer: "#1D192B",
    error: "#B3261E",
    onError: "#FFFFFF",
    background: "#FFFBFE",
    onBackground: "#1C1B1F",
    surface: "#FFFBFE",
    onSurface: "#1C1B1F",
    surfaceVariant: "#E7E0EC",
    onSurfaceVariant: "#79747E",
    outlineVariant: "#CAC4D0",
  },
};

/**
 * Dark Theme（紫色调优化版）
 */
export const DarkTheme: MD3Theme = {
  ...baseDark,
  colors: {
    ...baseDark.colors,
    primary: "#D0BCFF",
    onPrimary: "#000000",
    primaryContainer: "#4F378B",
    onPrimaryContainer: "#EADDFF",
    secondary: "#CCC2DC",
    onSecondary: "#332D41",
    secondaryContainer: "#4A4458",
    onSecondaryContainer: "#E6E1E5",
    error: "#F2B8B5",
    onError: "#601410",
    background: "#1C1B1F",
    onBackground: "#E6E1E5",
    surface: "#1C1B1F",
    onSurface: "#E6E1E5",
    surfaceVariant: "#49454F",
    onSurfaceVariant: "#A8A2B0",
    outlineVariant: "#938F99",
  },
};

/**
 * Blue Theme（蓝色调优化版）
 */
export const BlueTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#0B57D0",
    onPrimary: "#FFFFFF",
    primaryContainer: "#A9C8F8",
    onPrimaryContainer: "#001D35",
    secondary: "#4F378B",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#D6D4E0",
    onSecondaryContainer: "#1A1C2B",
    error: "#B00020",
    onError: "#FFFFFF",
    background: "#EAF1FD",
    onBackground: "#17233C",
    surface: "#E8F0FE",
    onSurface: "#17233C",
    surfaceVariant: "#C2E7FF",
    onSurfaceVariant: "#5F6D7A",
    outlineVariant: "#94A7C0",
  },
};

/**
 * Green Theme（绿色调优化版）
 */
export const GreenTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#0B8043",
    onPrimary: "#FFFFFF",
    primaryContainer: "#A4D29F",
    onPrimaryContainer: "#00391E",
    secondary: "#4CAF50",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#B7DEC5",
    onSecondaryContainer: "#1F3521",
    error: "#B00020",
    onError: "#FFFFFF",
    background: "#E6F4EA",
    onBackground: "#1B3121",
    surface: "#D9F0DE",
    onSurface: "#1B3121",
    surfaceVariant: "#B7DEC5",
    onSurfaceVariant: "#5E7263",
    outlineVariant: "#87B49C",
  },
};
