import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TextStyle } from "react-native";

interface BreathingHintProps {
  text?: string;
  style?: TextStyle;
  textStyle?: TextStyle;
}

export default function BreathingHint({ text = "点击翻转", style, textStyle }: BreathingHintProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    breathing.start();
    return () => breathing.stop();
  }, [opacity]);

  return <Animated.Text style={[styles.hint, { opacity }, style, textStyle]}>{text}</Animated.Text>;
}

const styles = StyleSheet.create({
  hint: {
    // marginTop: 8,
    color: "#888",
    fontSize: 13,
    textAlign: "center",
  } as TextStyle,
});
