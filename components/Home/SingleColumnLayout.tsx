import type { Item } from "@/store/itemStore";
import React from "react";
import { Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Card } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";

interface ItemListProps {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function SingleColumnLayout({ items, refreshing, onRefresh, onEdit, onDelete }: ItemListProps) {
  const renderFrontItem = ({ item }: { item: Item }) => {
    console.log("item single", item);
    const days = item.dailyPrices?.length || 0;
    const avgPrice = days > 0 ? item.price / days : 0;

    return (
      <View style={styles.rowFront}>
        <Card style={styles.card} elevation={3}>
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
              <Text style={styles.dayCountText}>已过天数: {days} 天</Text>
            </View>
          </View>
        </Card>
      </View>
    );
  };

  const renderHiddenItem = ({ item }: { item: Item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity style={[styles.backBtn, styles.editBtn]} onPress={() => onEdit(item)}>
        <Text style={styles.backText}>编辑</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.backBtn, styles.deleteBtn]} onPress={() => onDelete(item)}>
        <Text style={styles.backText}>删除</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeListView
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderFrontItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-150}
      disableRightSwipe
      previewRowKey={items.length > 0 ? items[0].id : undefined}
      previewOpenValue={-40}
      previewOpenDelay={3000}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 100 }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text>暂无物品，点击右下角 + 添加</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  cardImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#e0e0e0",
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemDate: {
    color: "#555",
    fontSize: 13,
  },
  priceText: {
    fontWeight: "600",
    marginTop: 4,
  },
  avgPriceText: {
    fontSize: 13,
    color: "#4caf50",
    marginTop: 4,
  },
  dayCountText: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: "center",
  },

  rowFront: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  rowBack: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
  },
  backBtn: {
    width: 75,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  editBtn: {
    backgroundColor: "#4caf50",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  backText: {
    color: "#fff",
    fontWeight: "600",
  },
});
