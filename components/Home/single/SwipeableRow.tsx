// SwipeableRow.tsx

import * as Haptics from "expo-haptics";
import * as React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SWIPE_THRESHOLD_EDIT = -8;
const BUTTON_SPACING = 8;
const EDIT_WIDTH = 80;
const DELETE_WIDTH = 80;
const DELETE_EXPANDED_WIDTH = EDIT_WIDTH + DELETE_WIDTH + BUTTON_SPACING * 2; // 176
const LOCK_POSITION_EDIT = -DELETE_EXPANDED_WIDTH; // -176
const SWIPE_THRESHOLD_DELETE = -150;
const RIGHT_SWIPE_CLOSE_DISTANCE = 8; // 右滑关闭阈值

export type SwipeableRowProps = {
  id: string;
  children: React.ReactNode; // item内容
  onDelete: (id: string) => void; // 删除回调
  onEdit?: (id: string) => void; // 编辑回调，非必须
  openRowId: string | null;
  setOpenRowId: (id: string | null) => void;
  renderEditButton?: () => React.ReactNode; // 自定义编辑按钮
  renderDeleteButton?: () => React.ReactNode; // 自定义删除按钮
  showToast: (msg: string) => void;
};

export function SwipeableRow({
  id,
  children,
  onDelete,
  onEdit,
  openRowId,
  setOpenRowId,
  renderEditButton,
  renderDeleteButton,
  showToast,
}: SwipeableRowProps) {
  // 共享值，动画滑动位置和按钮宽度
  const translateX = useSharedValue(0);
  const rowHeight = useSharedValue(70);
  const deleteBtnWidth = useSharedValue(0);
  const editBtnWidth = useSharedValue(0);

  // 本地状态：是否显示编辑按钮，是否处于删除展开状态
  const [showEdit, setShowEdit] = React.useState(false);
  const [deleteTriggered, setDeleteTriggered] = React.useState(false);
  const [hasPassedDeleteThresholdOnce, setHasPassedDeleteThresholdOnce] = React.useState(false);

  const isOpen = openRowId === id;

  // 复位函数，关闭展开状态，动画归0
  const resetRow = () => {
    console.log(`[${id}] resetRow`);
    translateX.value = withTiming(0);
    setShowEdit(false);
    setDeleteTriggered(false);
    deleteBtnWidth.value = withTiming(0);
    editBtnWidth.value = withTiming(0);
    setHasPassedDeleteThresholdOnce(false);
  };

  React.useEffect(() => {
    if (!isOpen) {
      console.log(`[${id}] effect: not open, reset row`);
      resetRow();
    }
  }, [openRowId]);

  // 显示编辑和删除按钮动画
  const showButtons = () => {
    console.log(`[${id}] showButtons`);
    setShowEdit(true);
    deleteBtnWidth.value = withTiming(DELETE_WIDTH);
    editBtnWidth.value = withTiming(EDIT_WIDTH);
  };

  // 隐藏按钮动画
  const hideButtons = () => {
    console.log(`[${id}] hideButtons`);
    setShowEdit(false);
    deleteBtnWidth.value = withTiming(0);
    editBtnWidth.value = withTiming(0);
  };

  // 手势处理
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; openedTranslateX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.openedTranslateX = translateX.value;
      if (!isOpen) {
        console.log(`[${id}] gesture onStart: setOpenRowId`);
        runOnJS(setOpenRowId)(id);
      }
    },
    onActive: (event, ctx) => {
      let newTranslateX = ctx.startX + event.translationX;
      if (newTranslateX > 0) newTranslateX = 0;
      translateX.value = newTranslateX;

      // 右滑关闭逻辑
      if (ctx.openedTranslateX < 0) {
        const rightSwipeDistance = newTranslateX - ctx.openedTranslateX;
        if (rightSwipeDistance > RIGHT_SWIPE_CLOSE_DISTANCE) {
          console.log(`[${id}] right swipe > close distance, reset`);
          runOnJS(resetRow)();
          runOnJS(setOpenRowId)(null);
          runOnJS(showToast)("已关闭展开");
          return;
        }
      }

      // 左滑逻辑
      if (newTranslateX <= SWIPE_THRESHOLD_DELETE) {
        if (!hasPassedDeleteThresholdOnce) {
          console.log(`[${id}] first time passing delete threshold`);
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
          runOnJS(showToast)("再次滑动确认删除");
          runOnJS(setHasPassedDeleteThresholdOnce)(true);
          return;
        }
        if (!deleteTriggered) {
          console.log(`[${id}] trigger delete expand`);
          runOnJS(setShowEdit)(false);
          deleteBtnWidth.value = withTiming(DELETE_EXPANDED_WIDTH);
          editBtnWidth.value = withTiming(0);
          runOnJS(setDeleteTriggered)(true);
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
          runOnJS(showToast)("删除按钮加宽，编辑隐藏");
        }
      } else if (newTranslateX < SWIPE_THRESHOLD_EDIT && !deleteTriggered) {
        runOnJS(showButtons)();
        runOnJS(showToast)("显示编辑和删除按钮");
      } else if (newTranslateX > SWIPE_THRESHOLD_DELETE && deleteTriggered) {
        console.log(`[${id}] restore buttons from delete triggered`);
        runOnJS(setDeleteTriggered)(false);
        runOnJS(setHasPassedDeleteThresholdOnce)(false);
        runOnJS(showButtons)();
        runOnJS(showToast)("恢复编辑和删除按钮");
      } else if (newTranslateX > SWIPE_THRESHOLD_EDIT && !deleteTriggered) {
        runOnJS(hideButtons)();
      }
    },
    onEnd: () => {
      if (translateX.value <= SWIPE_THRESHOLD_DELETE) {
        if (deleteTriggered) {
          console.log(`[${id}] onEnd: delete triggered, animate hide`);
          deleteBtnWidth.value = withTiming(0, { duration: 500 }, () => {
            runOnJS(resetRow)();
            runOnJS(setOpenRowId)(null);
            runOnJS(showToast)("删除按钮已收起");
          });
          translateX.value = withTiming(0);
        } else {
          console.log(`[${id}] onEnd: close without delete triggered`);
          translateX.value = withTiming(0);
          runOnJS(resetRow)();
          runOnJS(setOpenRowId)(null);
        }
      } else if (translateX.value < SWIPE_THRESHOLD_EDIT) {
        translateX.value = withTiming(LOCK_POSITION_EDIT);
      } else {
        translateX.value = withTiming(0);
        runOnJS(resetRow)();
        runOnJS(setOpenRowId)(null);
      }
    },
  });

  // 动画样式
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

  const editBtnStyle = useAnimatedStyle(() => ({
    width: editBtnWidth.value,
  }));

  // 删除按钮点击
  const onPressDelete = () => {
    Alert.alert("确认删除这条记录？", "", [
      { text: "取消", style: "cancel", onPress: () => resetRow() },
      {
        text: "删除",
        style: "destructive",
        onPress: () => {
          rowHeight.value = withTiming(0, { duration: 300 }, () => {
            onDelete(id);
            setOpenRowId(null);
          });
        },
      },
    ]);
  };

  // 编辑按钮点击
  const onPressEdit = () => {
    if (onEdit) {
      onEdit(id);
    } else {
      Alert.alert("编辑功能", "这里可以跳转编辑页面");
    }
  };

  return (
    <Animated.View style={[styles.rowContainer, rowAnimatedStyle]}>
      <View style={styles.hiddenButtons}>
        <Animated.View style={[styles.editButton, editBtnStyle]}>
          {showEdit && (
            <View onTouchStart={onPressEdit}>
              {renderEditButton ? renderEditButton() : <Text style={styles.buttonText}>编辑</Text>}
            </View>
          )}
        </Animated.View>
        <Animated.View style={[styles.deleteButton, deleteBtnStyle]}>
          <View onTouchStart={onPressDelete}>
            {renderDeleteButton ? renderDeleteButton() : <Text style={styles.buttonText}>删除</Text>}
          </View>
        </Animated.View>
      </View>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.row, animatedStyle]} pointerEvents='box-none'>
          {children}
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
    paddingRight: BUTTON_SPACING,
    paddingLeft: BUTTON_SPACING,
    zIndex: 0,
  },
  editButton: {
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: BUTTON_SPACING,
    borderRadius: 6,
    overflow: "hidden",
  },
  deleteButton: {
    height: 50,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: BUTTON_SPACING,
    borderRadius: 6,
    overflow: "hidden",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
