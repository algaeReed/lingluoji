import type { MD3Theme } from "react-native-paper";
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperLightTheme } from "react-native-paper";

/**
 * 通用 Light 基础配置
 * - 基于 react-native-paper 默认 Light 主题拓展
 * - 设置圆角 roundness 为 8
 * - 定义基础颜色变量
 */
const baseLight = {
  ...PaperLightTheme,
  roundness: 8,
  colors: {
    ...PaperLightTheme.colors,
    primary: "#4CAF50", // 主要颜色，默认绿色
    secondary: "#03DAC6", // 次要颜色，青色
    background: "#FFFFFF", // 页面背景色，白色
    surface: "#F5F5F5", // 表面色，用于卡片、菜单等背景
    onPrimary: "#FFFFFF", // 主要颜色上的内容颜色（文字、图标）
    onBackground: "#000000", // 背景上的内容颜色
    surfaceVariant: "#E0E0E0", // 表面变体色，用于区分不同层级
    outlineVariant: "#79747E", // 轮廓线颜色，默认灰色，常用于边框或分割线
  },
};

/**
 * 通用 Dark 基础配置
 * - 基于 react-native-paper 默认 Dark 主题拓展
 * - 设置圆角 roundness 为 8
 * - 定义基础颜色变量
 */
const baseDark = {
  ...PaperDarkTheme,
  roundness: 8,
  colors: {
    ...PaperDarkTheme.colors,
    primary: "#BB86FC", // 主要颜色，紫色
    secondary: "#03DAC6", // 次要颜色，青色
    background: "#121212", // 页面背景色，深黑色
    surface: "#1F1F1F", // 表面色，用于卡片、菜单等背景
    onPrimary: "#000000", // 主要颜色上的内容颜色（文字、图标）
    onBackground: "#FFFFFF", // 背景上的内容颜色
    surfaceVariant: "#2C2C2C", // 表面变体色
    outlineVariant: "#938F99", // 轮廓线颜色，灰紫色
    onSurfaceVariant: "#CAC4D0", // 表面变体上的内容颜色，高对比度灰色
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
    onPrimary: "#FFFFFF", // 主要颜色文字为白色
    primaryContainer: "#EADDFF", // 主要容器色，浅紫色背景
    onPrimaryContainer: "#21005D", // 主要容器上的文字，深紫色
    secondary: "#625B71", // 次要颜色，灰紫色
    background: "#FFFBFE", // 页面背景，极浅紫灰
    surface: "#FFFBFE", // 表面色，同背景
    surfaceVariant: "#E7E0EC", // 表面变体色，浅紫灰
    outlineVariant: "#CAC4D0", // 轮廓线颜色，浅灰紫
    onSurfaceVariant: "#79747E", // 表面变体上的内容颜色，中灰色，推荐
  },
};

/**
 * Dark Theme（紫色调优化版）
 */
export const DarkTheme: MD3Theme = {
  ...baseDark,
  colors: {
    ...baseDark.colors,
    primary: "#D0BCFF", // 主要颜色，浅紫色
    onPrimary: "#000000", // 主要颜色文字为黑色
    primaryContainer: "#4F378B", // 主要容器色，深紫色
    onPrimaryContainer: "#EADDFF", // 主要容器上的文字，浅紫色
    secondary: "#CCC2DC", // 次要颜色，浅紫灰色
    background: "#1C1B1F", // 页面背景，深灰黑
    surface: "#1C1B1F", // 表面色，同背景
    surfaceVariant: "#49454F", // 表面变体色，灰紫色
    outlineVariant: "#938F99", // 轮廓线颜色，灰紫色
    onSurfaceVariant: "#A8A2B0", // 表面变体上的内容颜色，略亮灰紫色，推荐
  },
};

/**
 * Blue Theme（蓝色调优化版）
 */
export const BlueTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#0B57D0", // 主要颜色，深蓝色
    onPrimary: "#FFFFFF", // 主要颜色文字为白色
    primaryContainer: "#A9C8F8", // 主要容器色，浅蓝色
    onPrimaryContainer: "#001D35", // 主要容器上的文字，深蓝色
    secondary: "#4F378B", // 次要颜色，深紫蓝色
    background: "#EAF1FD", // 页面背景，浅蓝灰色
    surface: "#E8F0FE", // 表面色，浅蓝色
    surfaceVariant: "#C2E7FF", // 表面变体色，浅蓝
    outlineVariant: "#94A7C0", // 轮廓线颜色，蓝灰色
    onSurfaceVariant: "#5F6D7A", // 表面变体上的内容颜色，低饱和蓝灰，推荐
  },
};

/**
 * Green Theme（绿色调优化版）
 */
export const GreenTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#0B8043", // 主要颜色，深绿色
    onPrimary: "#FFFFFF", // 主要颜色文字为白色
    primaryContainer: "#A4D29F", // 主要容器色，浅绿色
    onPrimaryContainer: "#00391E", // 主要容器上的文字，深绿色
    secondary: "#4CAF50", // 次要颜色，绿色
    background: "#E6F4EA", // 页面背景，浅绿色
    surface: "#D9F0DE", // 表面色，浅绿色
    surfaceVariant: "#B7DEC5", // 表面变体色，浅绿灰
    outlineVariant: "#87B49C", // 轮廓线颜色，绿色灰
    onSurfaceVariant: "#5E7263", // 表面变体上的内容颜色，低饱和绿灰，推荐
  },
};
