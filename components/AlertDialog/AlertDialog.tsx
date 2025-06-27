import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type AlertType = "info" | "warning" | "error" | "success";

interface Props {
  visible: boolean;
  title?: React.ReactNode;
  message?: string;
  content?: React.ReactNode;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss: () => void;
  showCancel?: boolean;
  dismissable?: boolean;
  dialogStyle?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: StyleProp<ViewStyle>;
  confirmButtonStyle?: ViewStyle;
  cancelButtonStyle?: ViewStyle;
  confirmButtonTextStyle?: TextStyle;
  cancelButtonTextStyle?: TextStyle;
}

const AlertDialog: React.FC<Props> = ({
  visible,
  title = "提示",
  message,
  content,
  type = "info",
  confirmText = "确定",
  cancelText = "取消",
  onConfirm,
  onCancel,
  onDismiss,
  showCancel = true,
  dismissable = true,
  dialogStyle,
  titleStyle,
  contentStyle,
  confirmButtonStyle,
  cancelButtonStyle,
  confirmButtonTextStyle,
  cancelButtonTextStyle,
}) => {
  const { theme } = useTheme();
  const typeColors = {
    info: theme.colors.primary,
    success: theme.colors.onPrimary,
    warning: theme.colors.secondary,
    error: theme.colors.error,
  };

  const handleConfirm = () => {
    onConfirm?.();
    onDismiss();
  };

  const handleCancel = () => {
    onCancel?.();
    onDismiss();
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={dismissable ? onDismiss : undefined}
        style={[{ backgroundColor: theme.colors.background }, dialogStyle]}
      >
        <Dialog.Title style={[{ color: typeColors[type] }, titleStyle]}>{title}</Dialog.Title>
        <Dialog.Content style={contentStyle}>{content || <Text>{message}</Text>}</Dialog.Content>
        <Dialog.Actions>
          {showCancel && (
            <Button
              mode='outlined'
              onPress={handleCancel}
              style={[{ marginRight: 8, borderColor: theme.colors.outline }, cancelButtonStyle]}
              labelStyle={cancelButtonTextStyle}
            >
              {cancelText}
            </Button>
          )}
          <Button
            mode='contained'
            onPress={handleConfirm}
            style={[{ backgroundColor: typeColors[type] }, confirmButtonStyle]}
            labelStyle={[{ color: theme.colors.onPrimary }, confirmButtonTextStyle]}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default React.memo(AlertDialog);
