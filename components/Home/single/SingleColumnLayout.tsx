import React, { useCallback, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import {
  GestureState,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;

const EDIT_BUTTON_WIDTH = 80;
const DELETE_BUTTON_INITIAL_WIDTH = 80;
const DELETE_BUTTON_EXPANDED_WIDTH = 120;

export default function TwoStageSwipeRow() {
  const translateX = useSharedValue(0);
  const [showEdit, setShowEdit] = useState(false);

  // 标记是否进入第二阶段滑动
  const isSecondStage = useSharedValue(false);

  const deleteButtonWidth = useSharedValue(DELETE_BUTTON_INITIAL_WIDTH);

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const editButtonStyle = useAnimatedStyle(() => ({
    opacity: translateX.value <= -EDIT_BUTTON_WIDTH && !isSecondStage.value ? 1 : 0,
    width: EDIT_BUTTON_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4caf50",
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    width: deleteButtonWidth.value,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f44336",
  }));

  // 1. 手势移动事件，持续更新 translateX
  const onGestureEvent = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      const translationX = event.nativeEvent.translationX;
      if (translationX < 0) {
        translateX.value = translationX;

        if (translationX <= -EDIT_BUTTON_WIDTH && !isSecondStage.value) {
          runOnJS(setShowEdit)(true);
        } else if (translationX > -EDIT_BUTTON_WIDTH && !isSecondStage.value) {
          runOnJS(setShowEdit)(false);
        }
      }
    },
    [translateX, isSecondStage]
  );

  // 2. 手势状态变化事件（onEnded 或 onHandlerStateChange）
  const onHandlerStateChange = useCallback(
    (event: HandlerStateChangeEvent) => {
      // GestureState.END === 5，表示手势结束
      if (event.nativeEvent.state === GestureState.END) {
        if (!isSecondStage.value) {
          // 第一次滑动结束，判断是否停留在编辑按钮显示位置
          if (translateX.value <= -EDIT_BUTTON_WIDTH) {
            translateX.value = withTiming(-EDIT_BUTTON_WIDTH);
            runOnJS(setShowEdit)(true);
          } else {
            translateX.value = withTiming(0);
            runOnJS(setShowEdit)(false);
          }
        } else {
          // 第二次滑动结束，判断是否超过删除按钮展开宽度阈值
          if (translateX.value <= -DELETE_BUTTON_EXPANDED_WIDTH) {
            runOnJS(triggerDeleteAnimation)();
          } else {
            // 不满足阈值，恢复到第一次滑动位置
            isSecondStage.value = false;
            translateX.value = withTiming(-EDIT_BUTTON_WIDTH);
            deleteButtonWidth.value = DELETE_BUTTON_INITIAL_WIDTH;
            runOnJS(setShowEdit)(true);
          }
        }
      }
    },
    [translateX, isSecondStage, deleteButtonWidth]
  );

  // 触发删除按钮动画及弹窗
  const triggerDeleteAnimation = () => {
    isSecondStage.value = true;
    setShowEdit(false);

    deleteButtonWidth.value = withTiming(DELETE_BUTTON_EXPANDED_WIDTH, { duration: 200 }, () => {
      deleteButtonWidth.value = withTiming(DELETE_BUTTON_INITIAL_WIDTH, { duration: 200 }, () => {
        runOnJS(showConfirmDialog)();
      });
    });

    translateX.value = withTiming(-EDIT_BUTTON_WIDTH);
  };

  const showConfirmDialog = () => {
    Alert.alert(
      "确认删除",
      "确定要删除该项吗？",
      [
        {
          text: "取消",
          onPress: () => {
            translateX.value = withTiming(0);
            isSecondStage.value = false;
            deleteButtonWidth.value = DELETE_BUTTON_INITIAL_WIDTH;
            setShowEdit(false);
          },
          style: "cancel",
        },
        {
          text: "删除",
          onPress: () => {
            Alert.alert("已删除");
            translateX.value = withTiming(0);
            isSecondStage.value = false;
            deleteButtonWidth.value = DELETE_BUTTON_INITIAL_WIDTH;
            setShowEdit(false);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* 底部按钮层 */}
      <View style={styles.buttonsContainer}>
        {showEdit && (
          <Animated.View style={[styles.editButton, editButtonStyle]}>
            <Text style={{ color: "white" }}>编辑</Text>
          </Animated.View>
        )}
        <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
          <Text style={{ color: "white" }}>删除</Text>
        </Animated.View>
      </View>

      {/* 可滑动内容 */}
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={[styles.row, animatedRowStyle]}>
          <Text>这是列表项内容</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: "#eee",
  },
  buttonsContainer: {
    position: "absolute",
    right: 0,
    height: 60,
    flexDirection: "row",
  },
  editButton: {
    height: 60,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
    width: EDIT_BUTTON_WIDTH,
  },
  deleteButton: {
    height: 60,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
    width: DELETE_BUTTON_INITIAL_WIDTH,
  },
  row: {
    height: 60,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
