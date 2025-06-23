import ShakeDetector from "@/components/ShakeDetector/ShakeDetector";
import ShakeDialog from "@/components/ShakeDialog/ShakeDialog";
import { useSettingsStore } from "@/store/settingsStore";
import { useShakeDialogStore } from "@/store/shakeDialogStore";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useRef } from "react"; // 新增 useRef 用于缓存 showTabBar
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

function InnerApp() {
  const { theme } = useTheme();

  // 获取弹窗控制方法
  const setVisible = useShakeDialogStore((s) => s.setVisible);

  // 获取 showTabBar 状态，并用 useRef 缓存以避免重复读取
  const showTabBar = useSettingsStore((state) => state.showTabBar);
  const showTabBarRef = useRef(showTabBar);
  showTabBarRef.current = showTabBar; // 确保每次渲染时更新 ref

  // 加载字体
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <PaperProvider theme={theme}>
      {/* ShakeDialog 弹窗组件 */}
      <ShakeDialog />

      {/* 摇动检测组件 */}
      <ShakeDetector
        useGlobalDialog={false}
        threshold={6} // 调高阈值，减少误触发
        cooldown={3000} // 3 秒冷却
        onShake={() => {
          console.log("[Shake] 摇动触发，showTabBar:", showTabBarRef.current);

          // 仅在 showTabBar 为 false 时显示弹窗
          if (!showTabBarRef.current) {
            console.log("[Shake] 显示弹窗");
            setVisible(true);
          }
        }}
      />

      {/* 路由栈 */}
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
