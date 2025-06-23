import type { Item } from "@/store/itemStore";
import { useSettingsStore } from "@/store/settingsStore";
import { getUsageTimeDescription } from "@/utils/getUsageTimeDescription";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Animated, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";

interface ItemListProps {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

// iOS风格的震动反馈
const triggerHapticFeedback = (type: "light" | "medium" | "heavy" | "selection" = "medium") => {
  if (Platform.OS === "ios") {
    // iOS使用Expo Haptics
    switch (type) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "selection":
        Haptics.selectionAsync();
        break;
    }
  } else {
    // Android使用Vibration
    Vibration.vibrate(50);
  }
};

export default function SingleColumnLayout({ items, refreshing, onRefresh, onEdit, onDelete }: ItemListProps) {
  const isShort = useSettingsStore((state) => state.isShort);
  const forceType = useSettingsStore((state) => state.forceType);
  const [swipedRow, setSwipedRow] = useState<string | null>(null);
  const rowRefs = useRef<{ [key: string]: SwipeRow<any> }>({});

  const renderFrontItem = ({ item }: { item: Item }) => {
    const days = item.dailyPrices?.length || 0;
    const avgPrice = days > 0 ? item.price / days : 0;

    return (
      <Animated.View style={styles.rowFront}>
        <Card style={styles.card} elevation={Platform.OS === "ios" ? 0 : 3}>
          <View style={styles.cardContent}>
            {item.imageUri ? (
              <Card.Cover source={{ uri: item.imageUri }} style={styles.cardImage} />
            ) : (
              <Avatar.Icon icon='image-off-outline' size={56} style={styles.avatarPlaceholder} />
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDate}>购买日期: {item.purchaseDate}</Text>
              <Text style={styles.priceText}>总价格: ¥{item.price.toFixed(2)}</Text>
              <Text style={styles.avgPriceText}>日均价格: ¥{avgPrice.toFixed(2)}</Text>
              <Text style={styles.dayCountText}>
                已过天数:
                {getUsageTimeDescription(days, forceType, isShort)?.text}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };

  const renderHiddenItem = ({ item }: { item: Item }) => (
    <View style={styles.rowBack}>
      {/* 编辑按钮 */}
      <TouchableOpacity
        style={[styles.backBtn, styles.editBtn]}
        onPress={() => {
          triggerHapticFeedback("selection");
          onEdit(item);
          // 关闭滑动行
          if (rowRefs.current[item.id]) {
            rowRefs.current[item.id].closeRow();
          }
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.editBtnText}>编辑</Text>
      </TouchableOpacity>

      {/* 删除按钮 - iOS风格 */}
      <TouchableOpacity
        style={[styles.backBtn, styles.deleteBtn]}
        onPress={() => {
          triggerHapticFeedback("heavy");
          onDelete(item);
        }}
        activeOpacity={0.9}
      >
        <Text style={styles.deleteBtnText}>删除</Text>
      </TouchableOpacity>
    </View>
  );

  const onRowDidOpen = (rowKey: string) => {
    setSwipedRow(rowKey);
    // 轻微震动反馈
    triggerHapticFeedback("light");
  };

  const onRowDidClose = (rowKey: string) => {
    if (swipedRow === rowKey) {
      setSwipedRow(null);
    }
  };

  const onSwipeValueChange = (swipeData: any) => {
    const { key, value } = swipeData;

    // 当滑动到一定程度时给予反馈
    if (Math.abs(value) > 50 && Math.abs(value) < 60) {
      triggerHapticFeedback("selection");
    }
  };

  return (
    <SwipeListView
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderFrontItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-150}
      disableRightSwipe={true}
      closeOnRowBeginSwipe={true}
      closeOnScroll={true}
      closeOnRowPress={true}
      swipeToOpenPercent={10}
      swipeToClosePercent={10}
      onRowDidOpen={onRowDidOpen}
      onRowDidClose={onRowDidClose}
      onSwipeValueChange={onSwipeValueChange}
      previewRowKey={items.length > 0 ? items[0].id : undefined}
      previewOpenValue={-40}
      previewOpenDelay={3000}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Platform.OS === "ios" ? "#007AFF" : undefined}
        />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Platform.OS === "ios" ? 12 : 8,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    // iOS风格阴影
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }
      : {
          elevation: 2,
        }),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  cardImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#f0f0f0",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "#000",
    marginBottom: 4,
  },
  itemDate: {
    color: "#8E8E93",
    fontSize: 14,
    lineHeight: 18,
  },
  priceText: {
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    fontSize: 15,
    color: "#000",
    marginTop: 6,
  },
  avgPriceText: {
    fontSize: 14,
    color: "#34C759",
    marginTop: 2,
    fontWeight: Platform.OS === "ios" ? "500" : "600",
  },
  dayCountText: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },

  rowFront: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    marginVertical: Platform.OS === "ios" ? 4 : 6,
  },
  rowBack: {
    position: "absolute",
    top: Platform.OS === "ios" ? 4 : 6,
    bottom: Platform.OS === "ios" ? 4 : 6,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "stretch",
    borderRadius: Platform.OS === "ios" ? 12 : 8,
    overflow: "hidden",
  },
  backBtn: {
    width: 75,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44, // iOS最小触摸目标
  },
  editBtn: {
    backgroundColor: Platform.OS === "ios" ? "#007AFF" : "#2196F3",
  },
  deleteBtn: {
    backgroundColor: Platform.OS === "ios" ? "#FF3B30" : "#F44336",
  },
  editBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
  deleteBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
  },
});
