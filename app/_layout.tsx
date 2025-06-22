import ShakeDetector from "@/components/ShakeDetector/ShakeDetector";
import ShakeDialog from "@/components/ShakeDialog/ShakeDialog";
import { useSettingsStore } from "@/store/settingsStore";
import { useShakeDialogStore } from "@/store/shakeDialogStore";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider"; // 这里导入你写好的 ThemeProvider 和 useTheme
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

function InnerApp() {
  // 从 ThemeProvider 拿主题
  const { theme } = useTheme();

  const setVisible = useShakeDialogStore((s) => s.setVisible);
  const showTabBar = useSettingsStore((state) => state.showTabBar);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <PaperProvider theme={theme}>
      <ShakeDialog />

      <ShakeDetector
        useGlobalDialog={false}
        threshold={4.5}
        cooldown={3000}
        onShake={() => {
          console.log("摇动触发了自定义回调");
          if (!showTabBar) setVisible(true);
        }}
      />

      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' />
        <Stack.Screen name='theme' />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}
