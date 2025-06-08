import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { MD3Theme, Provider as PaperProvider, useTheme } from "react-native-paper";

import DraggableFAB from "@/components/DraggableFAB/DraggableFAB";
import AddItemModal from "@/components/HModal/AddItemModal";
import EditItemModal from "@/components/HModal/EditItemModal";
import ItemListLayout from "@/components/Home/ItemListLayout";
import SummaryCard from "@/components/SummaryCard/SummaryCard";
import { Item, useItemsStore } from "@/store/itemStore";
import { useSettingsStore } from "@/store/settingsStore";
import EmptyPage from "../../components/EmptyPage";

function Content(props: {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}) {
  const { items, refreshing, onRefresh, onEdit, onDelete } = props;

  if (items.length === 0) {
    return <EmptyPage />;
  }

  return (
    <>
      <SummaryCard items={items} />
      <ItemListLayout items={items} refreshing={refreshing} onRefresh={onRefresh} onEdit={onEdit} onDelete={onDelete} />
    </>
  );
}

export default function App() {
  const theme: MD3Theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const { layoutMode } = useSettingsStore();
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

  const handleItemEdit = (item: Item) => {
    setEditingItem(item);
    setEditModalVisible(true);
  };

  const handleItemDelete = (item: Item) => {
    Alert.alert(
      "确认删除",
      `确定要删除「${item.name}」吗？`,
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: () => {
            deleteItem(item.id);
            if (editingItem?.id === item.id) {
              setEditingItem(null);
              setEditModalVisible(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
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

  const closeEditModal = () => {
    setEditingItem(null);
    setEditModalVisible(false);
  };

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Content
            items={items}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEdit={handleItemEdit}
            onDelete={handleItemDelete}
          />
        </View>

        <AddItemModal visible={addModalVisible} onDismiss={closeAddModal} onSave={handleAddSave} />
        {editingItem && (
          <EditItemModal
            visible={editModalVisible}
            onDismiss={closeEditModal}
            onSave={handleEditSave}
            onDelete={() => handleItemDelete(editingItem)}
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
  header: {
    marginTop: 50,
  },
});
