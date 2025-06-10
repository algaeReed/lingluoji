// components/ShakeDialog.tsx
import { useSettingsStore } from "@/store/settingsStore";
import { useShakeDialogStore } from "@/store/shakeDialogStore";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

export default function ShakeDialog() {
  const { visible, setVisible } = useShakeDialogStore();
  const setShowTabBar = useSettingsStore((state) => state.setShowTabBar);
  const showTabBar = useSettingsStore((state) => state.showTabBar);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>提示</Dialog.Title>
        <Dialog.Content>
          <Text>你摇了一下手机！</Text>
        </Dialog.Content>

        {/* 自定义按钮布局 */}
        <Dialog.Actions>
          <View style={styles.actionsContainer}>
            <Button
              // mode='outlined'
              onPress={() => setShowTabBar(!showTabBar)}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {showTabBar ? "隐藏底部栏" : "显示底部栏"}
            </Button>
            <Button onPress={() => setVisible(false)} style={styles.button} contentStyle={styles.buttonContent}>
              关闭
            </Button>
          </View>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // 左右对齐
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 4,
  },
  button: {
    borderRadius: 10,
    marginTop: 8,
    elevation: 2,
    minWidth: 120,
  },
  buttonContent: {
    height: 48,
  },
});
