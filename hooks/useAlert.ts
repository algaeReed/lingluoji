// src/hooks/useAlert.ts
import { useState } from "react";

type AlertType = "info" | "warning" | "error" | "success";
type AlertOptions = {
  title?: string;
  type?: AlertType;
  duration?: number; // 自动关闭时间（毫秒），0表示不自动关闭
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
};

export default function useAlert() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState<{
    message: string;
    options: AlertOptions;
  }>({
    message: "",
    options: {
      title: "提示",
      type: "info",
      duration: 0,
      confirmText: "确定",
      cancelText: "取消",
      showCancel: false,
    },
  });

  const showAlert = (message: string, options?: AlertOptions) => {
    setAlertProps({
      message,
      options: {
        ...alertProps.options,
        ...options,
        title: options?.title || alertProps.options.title,
      },
    });
    setAlertVisible(true);

    // 自动关闭功能
    if (options?.duration && options.duration > 0) {
      setTimeout(() => {
        setAlertVisible(false);
        options.onConfirm?.();
      }, options.duration);
    }
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  return {
    alertVisible,
    alertMessage: alertProps.message,
    alertTitle: alertProps.options.title,
    alertType: alertProps.options.type,
    alertOptions: alertProps.options,
    showAlert,
    hideAlert,
  };
}
