// SwipeDeleteExample.tsx

import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Alert, Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD_EDIT = -60;
const SWIPE_THRESHOLD_DELETE = -150;

type Item = {
  id: string;
  text: string;
};

export default function SwipeDeleteExample() {
  const [data, setData] = useState<Item[]>([
    { id: "1", text: "第一条手记" },
    { id: "2", text: "第二条手记" },
    { id: "3", text: "第三条手记" },
  ]);

  const onDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }: { item: Item }) => <SwipeableItem item={item} onDelete={onDelete} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: 50 }}>
      <FlatList data={data} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </GestureHandlerRootView>
  );
}

type SwipeableItemProps = {
  item: Item;
  onDelete: (id: string) => void;
};

function SwipeableItem({ item, onDelete }: SwipeableItemProps) {
  const translateX = useSharedValue(0);
  const rowHeight = useSharedValue(70);
  const deleteBtnWidth = useSharedValue(80);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteTriggered, setDeleteTriggered] = useState(false);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      let newTranslateX = ctx.startX + event.translationX;
      if (newTranslateX > 0) newTranslateX = 0;
      translateX.value = newTranslateX;

      if (newTranslateX < SWIPE_THRESHOLD_EDIT && !deleteTriggered) {
        runOnJS(setShowEdit)(true);
      } else if (newTranslateX > SWIPE_THRESHOLD_EDIT && !deleteTriggered) {
        runOnJS(setShowEdit)(false);
      }

      if (newTranslateX < SWIPE_THRESHOLD_DELETE && !deleteTriggered) {
        deleteBtnWidth.value = withTiming(120, { duration: 200 });
        runOnJS(setDeleteTriggered)(true);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      } else if (newTranslateX > SWIPE_THRESHOLD_DELETE && deleteTriggered) {
        deleteBtnWidth.value = withTiming(80);
        runOnJS(setDeleteTriggered)(false);
      }
    },
    onEnd: () => {
      if (translateX.value < SWIPE_THRESHOLD_EDIT) {
        translateX.value = withTiming(SWIPE_THRESHOLD_EDIT);
      } else {
        translateX.value = withTiming(0);
        runOnJS(setShowEdit)(false);
        runOnJS(setDeleteTriggered)(false);
        deleteBtnWidth.value = withTiming(80);
      }
    },
  });

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    height: rowHeight.value,
    marginVertical: rowHeight.value === 0 ? 0 : 5,
    opacity: interpolate(rowHeight.value, [0, 70], [0, 1]),
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    zIndex: 1,
  }));

  const deleteBtnStyle = useAnimatedStyle(() => ({
    width: deleteBtnWidth.value,
  }));

  const onPressDelete = () => {
    Alert.alert("确认删除这条记录？", "", [
      {
        text: "取消",
        style: "cancel",
        onPress: () => {
          translateX.value = withTiming(0);
          setShowEdit(false);
          setDeleteTriggered(false);
          deleteBtnWidth.value = withTiming(80);
        },
      },
      {
        text: "删除",
        style: "destructive",
        onPress: () => {
          rowHeight.value = withTiming(0, { duration: 300 }, () => {
            runOnJS(onDelete)(item.id);
          });
        },
      },
    ]);
  };

  return (
    <Animated.View style={[styles.rowContainer, rowAnimatedStyle]}>
      {/* 背景按钮 */}
      <View style={styles.hiddenButtons}>
        {showEdit && (
          <View style={styles.editButton}>
            <Text style={{ color: "white" }}>编辑</Text>
          </View>
        )}
        {deleteTriggered && (
          <Animated.View style={[styles.deleteButton, deleteBtnStyle]}>
            <Text style={{ color: "white" }} onPress={onPressDelete}>
              删除
            </Text>
          </Animated.View>
        )}
      </View>

      {/* 前景内容 */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.row, animatedStyle]} pointerEvents='box-none'>
          <Text>{item.text}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#fff",
    position: "relative",
  },
  row: {
    height: 70,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  hiddenButtons: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    zIndex: 0,
  },
  editButton: {
    width: 60,
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderRadius: 6,
  },
  deleteButton: {
    height: 50,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
});
