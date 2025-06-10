import type { MD3Theme } from "react-native-paper";

import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperLightTheme } from "react-native-paper";

const baseLight = {
  ...PaperLightTheme,
  roundness: 8,
  colors: {
    ...PaperLightTheme.colors,
    primary: "#4CAF50", // 默认绿色按钮
    secondary: "#03DAC6",
    background: "#FFFFFF",
    surface: "#F5F5F5",
    onPrimary: "#FFFFFF",
    onBackground: "#000000",
  },
};

const baseDark = {
  ...PaperDarkTheme,
  roundness: 8,
  colors: {
    ...PaperDarkTheme.colors,
    primary: "#BB86FC", // 默认紫色按钮
    secondary: "#03DAC6",
    background: "#121212",
    surface: "#1F1F1F",
    onPrimary: "#000000",
    onBackground: "#FFFFFF",
  },
};

export const LightTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#6200EE", // 紫色
    secondary: "#03DAC5",
  },
};

export const DarkTheme: MD3Theme = {
  ...baseDark,
  colors: {
    ...baseDark.colors,
    primary: "#BB86FC", // 紫色
    secondary: "#03DAC5",
  },
};

export const BlueTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#2196F3", // 蓝色
    secondary: "#03A9F4",
    background: "#E3F2FD",
    surface: "#E1F5FE",
  },
};

export const GreenTheme: MD3Theme = {
  ...baseLight,
  colors: {
    ...baseLight.colors,
    primary: "#4CAF50", // 绿色
    secondary: "#81C784",
    background: "#E8F5E9",
    surface: "#C8E6C9",
  },
};
