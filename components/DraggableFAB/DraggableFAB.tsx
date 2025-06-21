import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet } from "react-native";
import { FAB, useTheme } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const FAB_SIZE = 56;
const MARGIN = 20;

type Props = {
  onPress?: () => void;
  autoSnap?: boolean;
  topMargin?: number;
  bottomMargin?: number;
  initialPosition?: "left" | "center" | "right";
  draggable?: boolean;
  longPressToCenter?: boolean; // ✅ 新增参数：长按移动到底部中间
};

export default function DraggableFAB({
  autoSnap = true,
  topMargin = 20,
  bottomMargin = 140,
  onPress,
  initialPosition = "right",
  draggable = true,
  longPressToCenter = false, // 默认关闭
}: Props) {
  const theme = useTheme();

  const initialX =
    initialPosition === "left"
      ? MARGIN
      : initialPosition === "center"
      ? (SCREEN_WIDTH - FAB_SIZE) / 2
      : SCREEN_WIDTH - FAB_SIZE - MARGIN;

  const position = useRef({
    x: initialX,
    y: SCREEN_HEIGHT - bottomMargin,
  }).current;

  const pan = useRef(new Animated.ValueXY(position)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => draggable,
      onMoveShouldSetPanResponder: () => draggable,

      onPanResponderGrant: () => {
        pan.setOffset({ x: position.x, y: position.y });
        pan.setValue({ x: 0, y: 0 });
      },

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        let newX = position.x + gestureState.dx;
        let newY = position.y + gestureState.dy;

        const minY = topMargin;
        const maxY = SCREEN_HEIGHT - bottomMargin - FAB_SIZE;
        newY = Math.max(minY, Math.min(newY, maxY));

        if (autoSnap) {
          newX = newX + FAB_SIZE / 2 < SCREEN_WIDTH / 2 ? MARGIN : SCREEN_WIDTH - FAB_SIZE - MARGIN;
        } else {
          newX = Math.max(MARGIN, Math.min(newX, SCREEN_WIDTH - FAB_SIZE - MARGIN));
        }

        Animated.spring(pan, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
          bounciness: 8,
        }).start();

        position.x = newX;
        position.y = newY;
      },
    })
  ).current;

  // ✅ 长按移动到底部中间位置
  const handleLongPress = () => {
    if (!longPressToCenter) return;

    const centerX = (SCREEN_WIDTH - FAB_SIZE) / 2;
    const centerY = SCREEN_HEIGHT - bottomMargin;

    Animated.spring(pan, {
      toValue: { x: centerX, y: centerY },
      useNativeDriver: false,
      bounciness: 10,
    }).start();

    position.x = centerX;
    position.y = centerY;
  };

  return (
    <Animated.View
      style={[styles.fabContainer, { transform: pan.getTranslateTransform() }]}
      {...(draggable ? panResponder.panHandlers : {})}
    >
      <FAB
        icon='plus'
        onPress={onPress}
        onLongPress={handleLongPress} // ✅ 绑定长按事件
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
