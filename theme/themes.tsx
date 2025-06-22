import type { MD3Theme } from "react-native-paper";
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperLightTheme } from "react-native-paper";

// === 通用 Light 基础配置 ===
const baseLight = {
  ...PaperLightTheme,
  roundness: 8,
  colors: {
    ...PaperLightTheme.colors,
    primary: "#4CAF50", // 默认绿色按钮（可被后续主题覆盖）
    secondary: "#03DAC6",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    onPrimary: "#FFFFFF",
    onBackground: "#000000",
    surfaceVariant: "#E0E0E0",
  },
};

// === 通用 Dark 基础配置 ===
const baseDark = {
  ...PaperDarkTheme,
  roundness: 8,
  colors: {
    ...PaperDarkTheme.colors,
    primary: "#BB86FC",
    secondary: "#03DAC6",
    background: "#121212",
    surface: "#1F1F1F",
    onPrimary: "#000000",
    onBackground: "#FFFFFF",
    surfaceVariant: "#2C2C2C",
  },
};

// === Light Theme（优化后的紫色）===
export const LightTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#6750A4", // Material3 紫色主色
    secondary: "#625B71",
    background: "#FFFBFE",
    surface: "#FFFBFE",
    surfaceVariant: "#E7E0EC", // 变体色：淡紫
  },
};

// === Dark Theme（优化后的紫色）===
export const DarkTheme: MD3Theme = {
  ...baseDark,
  colors: {
    ...baseDark.colors,
    primary: "#D0BCFF", // 暗色主题下的浅紫色
    secondary: "#CCC2DC",
    background: "#1C1B1F",
    surface: "#1C1B1F",
    surfaceVariant: "#49454F", // 深紫变体色
  },
};

// === Blue Theme（优化后的蓝色）===
export const BlueTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#0B57D0", // 深蓝色主色（Material Blue 40）
    secondary: "#4F378B", // 与蓝色互补
    background: "#EAF1FD",
    surface: "#E8F0FE",
    surfaceVariant: "#C2E7FF", // 浅蓝色变体
  },
};

// === Green Theme（优化后的绿色）===
export const GreenTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#0B8043", // Material Green 40
    secondary: "#4CAF50",
    background: "#E6F4EA",
    surface: "#D9F0DE",
    surfaceVariant: "#B7DEC5", // 浅绿变体
  },
};
