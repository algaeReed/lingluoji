import { Animated, ViewStyle } from "react-native";
import { getInputRangeFromIndexes } from "react-native-snap-carousel";

export function scrollInterpolator2(index: number, carouselProps: any) {
  const range = [2, 1, 0, -1];
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = range;
  return { inputRange, outputRange };
}

export function animatedStyles2(
  index: number,
  animatedValue: Animated.AnimatedInterpolation<string | number>,
  carouselProps: any
): ViewStyle {
  const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;

  // translate 动画（必须固定 key）
  const translate = carouselProps.vertical
    ? {
        translateY: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2],
          outputRange: [0, 0, -sizeRef + 30, -sizeRef * 2 + 45],
          extrapolate: "clamp",
        }) as unknown as number,
      }
    : {
        translateX: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2],
          outputRange: [0, 0, -sizeRef + 30, -sizeRef * 2 + 45],
          extrapolate: "clamp",
        }) as unknown as number,
      };

  return {
    zIndex: carouselProps.data.length - index,
    opacity: animatedValue.interpolate({
      inputRange: [-1, 0, 1, 2],
      outputRange: [0.75, 1, 0.6, 0.4],
      extrapolate: "clamp",
    }) as unknown as number,
    transform: [
      {
        rotate: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2],
          outputRange: ["0deg", "0deg", "5deg", "8deg"],
          extrapolate: "clamp",
        }) as unknown as string,
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [-1, 0, 1, 2],
          outputRange: [0.96, 1, 0.85, 0.7],
          extrapolate: "clamp",
        }) as unknown as number,
      },
      translate,
    ],
  };
}
