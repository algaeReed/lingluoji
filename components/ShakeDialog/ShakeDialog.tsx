// components/ShakeDialog.tsx
import { useSettingsStore } from "@/store/settingsStore";
import { useShakeDialogStore } from "@/store/shakeDialogStore";
import React from "react";
import { StyleSheet } from "react-native";
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

        <Button
          mode='outlined'
          onPress={() => setShowTabBar(!showTabBar)}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {showTabBar ? "隐藏底部栏" : "显示底部栏"}
        </Button>

        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>关闭</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    marginTop: 8,
    elevation: 2,
  },
  buttonContent: {
    height: 48,
  },
});
