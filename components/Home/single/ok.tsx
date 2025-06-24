// TwoStageSwipeList.tsx

import * as Haptics from "expo-haptics"; // 震动反馈，可根据你项目替换或删除
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// --- 常量定义 ---
const SCREEN_WIDTH = Dimensions.get("window").width;
const EDIT_BUTTON_WIDTH = 60;
const DELETE_BUTTON_WIDTH = 80;
const DELETE_BUTTON_WIDTH_EXPANDED = 120;
const SWIPE_STAGE1_MIN = -40;
const SWIPE_STAGE1_MAX = -140;
const SWIPE_STAGE2_TRIGGER = -150;
const SWIPE_MAX_LEFT = -180; // 防止滑动超出过多

// 列表项数据类型
type Item = {
  id: string;
  text: string;
};

// 组件 Props
type TwoStageSwipeRowProps = {
  item: Item;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  currentlyOpenId: string | null;
  setCurrentlyOpenId: (id: string | null) => void;
};

export default function TwoStageSwipeList() {
  // 列表数据，示例初始化5项
  const [data, setData] = useState<Item[]>([
    { id: "1", text: "第一条任务" },
    { id: "2", text: "第二条任务" },
    { id: "3", text: "第三条任务" },
    { id: "4", text: "第四条任务" },
    { id: "5", text: "第五条任务" },
  ]);

  // 记录当前展开项id，保证只有一个展开
  const [currentlyOpenId, setCurrentlyOpenId] = useState<string | null>(null);

  // 删除逻辑：执行动画后从列表移除
  const handleDelete = useCallback(
    (id: string) => {
      // 安卓需要开启 LayoutAnimation 支持
      if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
      // 带动画收缩
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setData((old) => old.filter((item) => item.id !== id));
      setCurrentlyOpenId(null);
    },
    [setData]
  );

  // 编辑回调
  const handleEdit = useCallback((id: string) => {
    Alert.alert("编辑", `编辑项 ${id}（这里自行实现编辑逻辑）`);
  }, []);

  // 渲染列表项
  const renderItem = ({ item }: { item: Item }) => (
    <TwoStageSwipeRow
      key={item.id}
      item={item}
      onDelete={handleDelete}
      onEdit={handleEdit}
      currentlyOpenId={currentlyOpenId}
      setCurrentlyOpenId={setCurrentlyOpenId}
    />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </GestureHandlerRootView>
  );
}

// --- TwoStageSwipeRow 组件实现 ---
function TwoStageSwipeRow({ item, onDelete, onEdit, currentlyOpenId, setCurrentlyOpenId }: TwoStageSwipeRowProps) {
  // 动画共享值：水平位移
  const translateX = useSharedValue(0);
  // 删除按钮宽度动画共享值（默认80）
  const deleteBtnWidth = useSharedValue(DELETE_BUTTON_WIDTH);
  // 记录当前阶段：true表示第二阶段（删除按钮放大，隐藏编辑按钮）
  const isStage2 = useSharedValue(false);
  // 是否已经正在删除动画中
  const isDeleting = useRef(false);

  // 自动关闭（收起）函数
  const close = useCallback(() => {
    translateX.value = withTiming(0);
    deleteBtnWidth.value = withTiming(DELETE_BUTTON_WIDTH);
    isStage2.value = false;
    if (currentlyOpenId === item.id) {
      runOnJS(setCurrentlyOpenId)(null);
    }
  }, [currentlyOpenId, item.id, setCurrentlyOpenId, translateX, deleteBtnWidth, isStage2]);

  // 关闭其他展开项时，自动关闭本项
  React.useEffect(() => {
    if (currentlyOpenId !== item.id) {
      close();
    }
  }, [currentlyOpenId, close, item.id]);

  // 处理手势事件
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number }>({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      // 如果当前不是展开项，且有别的项展开，滑动时请求关闭别的展开项（在JS线程）
      if (currentlyOpenId && currentlyOpenId !== item.id) {
        runOnJS(setCurrentlyOpenId)(null);
      }
    },
    onActive: (event, ctx) => {
      let newTranslateX = ctx.startX + event.translationX;
      // 限制向左最大滑动距离
      if (newTranslateX < SWIPE_MAX_LEFT) newTranslateX = SWIPE_MAX_LEFT;
      // 限制不能往右滑动超过0
      if (newTranslateX > 0) newTranslateX = 0;

      translateX.value = newTranslateX;

      // 根据滑动距离调整阶段和按钮宽度
      if (newTranslateX <= SWIPE_STAGE2_TRIGGER) {
        // 第二阶段：删除按钮放大，隐藏编辑
        if (!isStage2.value) {
          isStage2.value = true;
          deleteBtnWidth.value = withTiming(DELETE_BUTTON_WIDTH_EXPANDED, {
            duration: 150,
          });
          // 震动反馈（只执行一次）
          // runOnJS(Haptics.impactAsync)("medium");
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

          runOnJS(setCurrentlyOpenId)(item.id);
        }
      } else if (newTranslateX >= SWIPE_STAGE1_MIN) {
        // 还没达到展开门槛，收起
        if (isStage2.value) {
          isStage2.value = false;
          deleteBtnWidth.value = withTiming(DELETE_BUTTON_WIDTH, { duration: 150 });
        }
      } else if (newTranslateX > SWIPE_STAGE2_TRIGGER && newTranslateX < SWIPE_STAGE1_MIN) {
        // 介于收起和第一阶段之间
        if (isStage2.value) {
          isStage2.value = false;
          deleteBtnWidth.value = withTiming(DELETE_BUTTON_WIDTH, { duration: 150 });
        }
      } else {
        // 第一阶段，编辑+删除按钮正常显示
        if (isStage2.value) {
          isStage2.value = false;
          deleteBtnWidth.value = withTiming(DELETE_BUTTON_WIDTH, { duration: 150 });
        }
        runOnJS(setCurrentlyOpenId)(item.id);
      }
    },
    onEnd: () => {
      // 根据当前 translateX 自动停靠位置
      const x = translateX.value;
      if (x <= SWIPE_STAGE2_TRIGGER) {
        // 第二阶段展开（删除按钮加宽）
        translateX.value = withTiming(SWIPE_STAGE2_TRIGGER);
        deleteBtnWidth.value = withTiming(DELETE_BUTTON_WIDTH_EXPANDED, { duration: 200 });
        isStage2.value = true;
        runOnJS(setCurrentlyOpenId)(item.id);
      } else if (x <= SWIPE_STAGE1_MAX && x > SWIPE_STAGE2_TRIGGER) {
        // 第一阶段展开
        translateX.value = withTiming(SWIPE_STAGE1_MAX);
        deleteBtnWidth.value = withTiming(DELETE_BUTTON_WIDTH, { duration: 200 });
        isStage2.value = false;
        runOnJS(setCurrentlyOpenId)(item.id);
      } else {
        // 收起
        translateX.value = withTiming(0);
        deleteBtnWidth.value = withTiming(DELETE_BUTTON_WIDTH, { duration: 200 });
        isStage2.value = false;
        runOnJS(setCurrentlyOpenId)(null);
      }
    },
  });

  // 动画样式 - 滑动内容位移
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // 动画样式 - 删除按钮宽度
  const animatedDeleteBtnStyle = useAnimatedStyle(() => ({
    width: deleteBtnWidth.value,
    // 编辑按钮显示/隐藏：第二阶段隐藏编辑按钮，第一阶段显示
    opacity: isStage2.value ? 0 : 1,
  }));

  // 编辑按钮样式动画：第二阶段隐藏
  const animatedEditBtnStyle = useAnimatedStyle(() => ({
    opacity: isStage2.value ? 0 : 1,
  }));

  // 删除按钮点击事件
  const onPressDelete = () => {
    if (isDeleting.current) return; // 防止重复点击
    Alert.alert(
      "确认删除",
      `确定删除“${item.text}”吗？`,
      [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "删除",
          style: "destructive",
          onPress: () => {
            isDeleting.current = true;
            // 收起动画 + 高度收缩动画
            translateX.value = withTiming(0);
            runOnJS(() => {
              // 这里用 LayoutAnimation 来做高度收缩动画
              if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
              }
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              onDelete(item.id);
              isDeleting.current = false;
            })();
          },
        },
      ],
      { cancelable: true }
    );
  };

  // 编辑按钮点击事件
  const onPressEdit = () => {
    onEdit(item.id);
  };

  return (
    <View style={styles.rowContainer}>
      {/* 按钮容器 - 绝对定位在右侧 */}
      <View style={styles.buttonsContainer} pointerEvents='box-none'>
        {/* 编辑按钮 */}
        <Animated.View style={[styles.editButton, animatedEditBtnStyle, { width: EDIT_BUTTON_WIDTH }]}>
          <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.6} onPress={onPressEdit}>
            <Text style={styles.editBtnText}>编辑</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* 删除按钮 */}
        <Animated.View style={[styles.deleteButton, animatedDeleteBtnStyle]}>
          <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.6} onPress={onPressDelete}>
            <Text style={styles.deleteBtnText}>删除</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* 滑动内容 */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.rowContent, animatedContentStyle]}>
          <Text style={styles.rowText}>{item.text}</Text>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

// --- 样式 ---
const styles = StyleSheet.create({
  rowContainer: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    // 为了让按钮显示不被遮挡，外层不要overflow: 'hidden'
  },
  rowContent: {
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingLeft: 20,
    // 阴影（iOS）
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // 阴影（安卓）
    elevation: 2,
  },
  rowText: {
    fontSize: 16,
    color: "#333",
  },
  buttonsContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    height: 60,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    height: 60,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
  btnTouchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
