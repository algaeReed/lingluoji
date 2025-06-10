import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet } from "react-native";
import { FAB, useTheme } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const FAB_SIZE = 56; // FAB默认尺寸
const MARGIN = 20; // 距离边缘的距离

type Props = {
  onPress?: () => void;
  autoSnap?: boolean; // 是否自动吸附左右边缘，默认true
  topMargin?: number; // 顶部边距，默认20
  bottomMargin?: number; // 底部边距，默认80
};

export default function DraggableFAB({ autoSnap = true, topMargin = 20, bottomMargin = 120, onPress }: Props) {
  const theme = useTheme();

  // 初始位置：右下角
  const position = useRef({
    x: SCREEN_WIDTH - FAB_SIZE - MARGIN,
    y: SCREEN_HEIGHT - bottomMargin,
  }).current;

  // Animated.ValueXY 初始化为当前位置
  const pan = useRef(new Animated.ValueXY(position)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.setOffset({ x: position.x, y: position.y });
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),

      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        // 计算新位置
        let newX = position.x + gestureState.dx;
        let newY = position.y + gestureState.dy;

        // 限制Y轴范围
        const minY = topMargin;
        const maxY = SCREEN_HEIGHT - bottomMargin - FAB_SIZE;
        newY = Math.max(minY, Math.min(newY, maxY));

        // 自动吸附左右边缘
        if (autoSnap) {
          newX = newX + FAB_SIZE / 2 < SCREEN_WIDTH / 2 ? MARGIN : SCREEN_WIDTH - FAB_SIZE - MARGIN;
        } else {
          // 限制X轴范围，防止拖出屏幕
          if (newX < MARGIN) newX = MARGIN;
          if (newX > SCREEN_WIDTH - FAB_SIZE - MARGIN) newX = SCREEN_WIDTH - FAB_SIZE - MARGIN;
        }

        // 用动画回弹到新位置
        Animated.spring(pan, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
          bounciness: 8,
        }).start();

        // 保存最新位置
        position.x = newX;
        position.y = newY;
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.fabContainer, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <FAB
        icon='plus'
        onPress={onPress}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    zIndex: 1000,
  },
  fab: {
    elevation: 6,
  },
});
