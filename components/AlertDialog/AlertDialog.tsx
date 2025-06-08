import React from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

interface Props {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

export default function AlertDialog({ visible, message, onDismiss }: Props) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>提示</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>确定</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
