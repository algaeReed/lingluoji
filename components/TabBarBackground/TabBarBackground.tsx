import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

export default function TabBarBackground() {
  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={50} tint='light' style={StyleSheet.absoluteFill}>
        {/* 半透明白色遮罩，增加柔和感 */}
        <View style={styles.overlay} />
      </BlurView>
    );
  }

  // 安卓下用半透明纯色背景
  return <View style={[StyleSheet.absoluteFill, styles.androidBackground]} />;
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  androidBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
};
