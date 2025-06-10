import type { ThemeMode } from "@/store/settingsStore"; // 导入 ThemeMode 类型
import { useSettingsStore } from "@/store/settingsStore";
import React, { createContext, useContext, useMemo } from "react";
import type { MD3Theme } from "react-native-paper";
import { PaperProvider } from "react-native-paper";
import { BlueTheme, DarkTheme, GreenTheme, LightTheme } from "./themes";

interface ThemeContextValue {
  theme: MD3Theme;
  toggleTheme: (nextMode?: ThemeMode) => void; // 改为 ThemeMode 类型
  themeMode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: LightTheme,
  toggleTheme: () => {},
  themeMode: "light",
});

export const useTheme = () => useContext(ThemeContext);

const themeMap: Record<ThemeMode, MD3Theme> = {
  light: LightTheme,
  dark: DarkTheme,
  blue: BlueTheme,
  green: GreenTheme,
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);

  const theme = useMemo(() => themeMap[themeMode], [themeMode]);

  const toggleTheme = (nextMode?: ThemeMode) => {
    const keys = Object.keys(themeMap) as ThemeMode[];
    if (nextMode && keys.includes(nextMode)) {
      setThemeMode(nextMode);
    } else {
      const idx = keys.indexOf(themeMode);
      const nextIdx = (idx + 1) % keys.length;
      setThemeMode(keys[nextIdx]);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeMode }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};
