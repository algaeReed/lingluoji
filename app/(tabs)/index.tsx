import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Platform, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Card, MD3Theme, Provider as PaperProvider, Switch, Text, useTheme } from "react-native-paper";

import DraggableFAB from "@/components/DraggableFAB/DraggableFAB";
import AddItemModal from "@/components/HModal/AddItemModal";
import EditItemModal from "@/components/HModal/EditItemModal";

type DailyPrice = {
  date: string;
  price: number;
};

type Item = {
  id: string;
  name: string;
  price: number;
  purchaseDate: string;
  dailyPrices: DailyPrice[];
  imageUri?: string;
};

export const STORAGE_KEY = "@items_storage";

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const theme: MD3Theme = {
    ...useTheme(),
    dark: isDarkTheme,
    mode: isDarkTheme ? "adaptive" : "exact",
  };

  // 生成每日均价数组
  const generateDailyPrices = (startDateISO: string, totalPrice: number): DailyPrice[] => {
    const startDate = dayjs(startDateISO).startOf("day");
    const endDate = dayjs().startOf("day");
    const daysCount = endDate.diff(startDate, "day") + 1;
    const avg = totalPrice / daysCount;
    return Array.from({ length: daysCount }, (_, i) => ({
      date: startDate.add(i, "day").format("YYYY-MM-DD"),
      price: avg,
    }));
  };

  // 加载数据
  const loadData = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setItems(JSON.parse(json));
    } catch (e) {
      console.warn("加载数据失败", e);
    }
  };

  // 保存数据
  const saveData = async (newItems: Item[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.warn("保存数据失败", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 下拉刷新
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  // 打开/关闭添加编辑弹窗
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

  // 添加物品保存
  const handleAddSave = (data: { name: string; price: number; purchaseDate: Date; imageUri?: string }) => {
    const dailyPrices = generateDailyPrices(dayjs(data.purchaseDate).format("YYYY-MM-DD"), data.price);
    const newItem: Item = {
      id: Date.now().toString(),
      name: data.name,
      price: data.price,
      purchaseDate: dayjs(data.purchaseDate).format("YYYY-MM-DD"),
      dailyPrices,
      imageUri: data.imageUri,
    };
    const newItems = [newItem, ...items];
    setItems(newItems);
    saveData(newItems);
    closeAddModal();
  };

  // 编辑物品保存
  const handleEditSave = (data: { name: string; price: number; purchaseDate: Date; imageUri?: string }) => {
    if (!editingItem) return;
    const dailyPrices = generateDailyPrices(dayjs(data.purchaseDate).format("YYYY-MM-DD"), data.price);
    const updatedItem: Item = {
      ...editingItem,
      name: data.name,
      price: data.price,
      purchaseDate: dayjs(data.purchaseDate).format("YYYY-MM-DD"),
      dailyPrices,
      imageUri: data.imageUri,
    };
    const newItems = items.map((it) => (it.id === editingItem.id ? updatedItem : it));
    setItems(newItems);
    saveData(newItems);
    closeEditModal();
  };

  // 删除物品
  const handleDelete = () => {
    if (!editingItem) return;
    const newItems = items.filter((it) => it.id !== editingItem.id);
    setItems(newItems);
    saveData(newItems);
    closeEditModal();
  };

  // 列表渲染
  const renderItem = ({ item }: { item: Item }) => {
    const days = item.dailyPrices.length;
    const avgPrice = item.price / days;

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
              <Text style={styles.dayCountText}>共 {days} 天</Text>
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    backgroundColor: "#6200ee",
    elevation: 6,
  },
});
