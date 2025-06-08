import ShakeDetector from "@/components/ShakeDetector/ShakeDetector";
import ShakeDialog from "@/components/ShakeDialog/ShakeDialog";
import { useSettingsStore } from "@/store/settingsStore";
import { useShakeDialogStore } from "@/store/shakeDialogStore";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

export default function RootLayout() {
  const setVisible = useShakeDialogStore((s) => s.setVisible);

  const showTabBar = useSettingsStore((state) => state.showTabBar);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <PaperProvider>
        <ShakeDialog />

        <ShakeDetector
          useGlobalDialog={false}
          threshold={4.5}
          cooldown={3000}
          onShake={() => {
            console.log("摇动触发了自定义回调");

            if (!showTabBar) setVisible(true); // 显示弹窗
          }}
        />
        {/* <Stack /> */}
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='+not-found' />
        </Stack>
        {/* <StatusBar style='auto' /> */}
      </PaperProvider>

      {/* <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' />
      </Stack>
      <StatusBar style='auto' /> */}
    </>
  );
}
