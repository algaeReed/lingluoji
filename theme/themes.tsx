import type { MD3Theme } from "react-native-paper";
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperLightTheme } from "react-native-paper";

// === 通用 Light 基础配置 ===
const baseLight = {
  ...PaperLightTheme,
  roundness: 8,
  colors: {
    ...PaperLightTheme.colors,
    primary: "#4CAF50",
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
    primary: "#6750A4",
    onPrimary: "#FFFFFF",
    primaryContainer: "#EADDFF", // 保持原配色
    onPrimaryContainer: "#21005D",
    secondary: "#625B71",
    background: "#FFFBFE",
    surface: "#FFFBFE",
    surfaceVariant: "#E7E0EC",
  },
};

// === Dark Theme（优化后的紫色）===
export const DarkTheme: MD3Theme = {
  ...baseDark,
  colors: {
    ...baseDark.colors,
    primary: "#D0BCFF",
    onPrimary: "#000000",
    primaryContainer: "#4F378B", // 保持原配色
    onPrimaryContainer: "#EADDFF",
    secondary: "#CCC2DC",
    background: "#1C1B1F",
    surface: "#1C1B1F",
    surfaceVariant: "#49454F",
  },
};

// === Blue Theme（优化后的蓝色）===
export const BlueTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#0B57D0",
    onPrimary: "#FFFFFF",
    primaryContainer: "#A9C8F8", // 微调为稍深的浅蓝
    onPrimaryContainer: "#001D35",
    secondary: "#4F378B",
    background: "#EAF1FD",
    surface: "#E8F0FE",
    surfaceVariant: "#C2E7FF",
  },
};

// === Green Theme（优化后的绿色）===
export const GreenTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#0B8043",
    onPrimary: "#FFFFFF",
    primaryContainer: "#A4D29F", // 微调为更鲜亮的淡绿
    onPrimaryContainer: "#00391E",
    secondary: "#4CAF50",
    background: "#E6F4EA",
    surface: "#D9F0DE",
    surfaceVariant: "#B7DEC5",
  },
};
