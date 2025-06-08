import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Card, MD3Theme, Provider as PaperProvider, Switch, Text, useTheme } from "react-native-paper";

import DraggableFAB from "@/components/DraggableFAB/DraggableFAB";
import AddItemModal from "@/components/HModal/AddItemModal";
import EditItemModal from "@/components/HModal/EditItemModal";
import SummaryCard from "@/components/SummaryCard/SummaryCard";
import { Item, useItemsStore } from "@/store/itemStore";
// import { Item } from "";

export default function App() {
  const theme: MD3Theme = useTheme();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const { items, loadItems, addItem, updateItem, deleteItem } = useItemsStore();

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);

  const openAddModal = () => setAddModalVisible(true);
  const closeAddModal = () => setAddModalVisible(false);

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setEditModalVisible(true);
  };
  const closeEditModal = () => {
    setEditingItem(null);
    setEditModalVisible(false);
  };

  const handleAddSave = (data: { name: string; price: number; purchaseDate: Date; imageUri?: string }) => {
    addItem({
      name: data.name,
      price: data.price,
      purchaseDate: dayjs(data.purchaseDate).format("YYYY-MM-DD"),
      imageUri: data.imageUri,
    });
    closeAddModal();
  };

  const handleEditSave = (data: { name: string; price: number; purchaseDate: Date; imageUri?: string }) => {
    if (!editingItem) return;
    updateItem(editingItem.id, {
      name: data.name,
      price: data.price,
      purchaseDate: dayjs(data.purchaseDate).format("YYYY-MM-DD"),
      imageUri: data.imageUri,
    });
    closeEditModal();
  };

  const handleDelete = () => {
    if (!editingItem) return;
    deleteItem(editingItem.id);
    closeEditModal();
  };

  const renderItem = ({ item }: { item: Item }) => {
    const days = item.dailyPrices?.length || 0;
    const avgPrice = days > 0 ? item.price / days : 0;

    return (
      <TouchableOpacity onPress={() => openEditModal(item)}>
        <Card style={styles.card} elevation={3}>
          <View style={styles.cardContent}>
            {item.imageUri ? (
              <Card.Cover source={{ uri: item.imageUri }} style={styles.cardImage} />
            ) : (
              <Avatar.Icon icon='image-off-outline' size={56} style={styles.avatarPlaceholder} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDate}>购买日期: {item.purchaseDate}</Text>
              <Text style={styles.priceText}>总价格: ¥{item.price.toFixed(2)}</Text>
              <Text style={styles.avgPriceText}>日均价格: ¥{avgPrice.toFixed(2)}</Text>
              <Text style={styles.dayCountText}>已过天数: {days} 天</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.themeSwitchRow}>
          <Text>暗色模式</Text>
          <Switch value={isDarkTheme} onValueChange={setIsDarkTheme} />
        </View>

        {items.length > 0 && <SummaryCard items={items} />}

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>暂无物品，点击右下角 + 添加</Text>
            </View>
          }
        />

        <AddItemModal visible={addModalVisible} onDismiss={closeAddModal} onSave={handleAddSave} />
        {editingItem && (
          <EditItemModal
            visible={editModalVisible}
            onDismiss={closeEditModal}
            onSave={handleEditSave}
            onDelete={handleDelete}
            initialData={{
              name: editingItem.name,
              price: editingItem.price,
              purchaseDate: dayjs(editingItem.purchaseDate).toDate(),
              imageUri: editingItem.imageUri,
            }}
          />
        )}

        <DraggableFAB onPress={openAddModal} />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  themeSwitchRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
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
    marginRight: 12,
    backgroundColor: "#e0e0e0",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDate: {
    color: "#555",
  },
  priceText: {
    fontWeight: "600",
    marginBottom: 6,
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
});
