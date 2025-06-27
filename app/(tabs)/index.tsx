import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { MD3Theme, Provider as PaperProvider, useTheme } from "react-native-paper";

import AlertDialog from "@/components/AlertDialog/AlertDialog";
import DraggableFAB from "@/components/DraggableFAB/DraggableFAB";
import AddItemModal from "@/components/HModal/AddItemModal";
import EditItemModal from "@/components/HModal/EditItemModal";
import ItemListLayout from "@/components/Home/ItemListLayout";
import SummaryCard from "@/components/SummaryCard/SummaryCard";
import useAlert from "@/hooks/useAlert";
import useAppUpdate from "@/hooks/useAppUpdate";
import { Item, useItemsStore } from "@/store/itemStore";
import { useSettingsStore } from "@/store/settingsStore";
import * as Haptics from "expo-haptics";
import EmptyPage from "../../components/EmptyPage";

function Content(props: {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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
  useAppUpdate(false);
  const { alertVisible, alertMessage, alertTitle, alertOptions, showAlert, hideAlert } = useAlert();

  const theme: MD3Theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const { layoutMode } = useSettingsStore();
  const { items, loadItems, addItem, updateItem, deleteItem } = useItemsStore();

  useEffect(() => {
    loadItems();
  }, []);

  const onRefresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);

  const openAddModal = () => {
    console.log("first");
    setAddModalVisible(true);
  };
  const closeAddModal = () => setAddModalVisible(false);

  const handleItemEdit = (id: string) => {
    const itemToEdit = items.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setEditModalVisible(true);
    }
  };

  const handleItemDelete = (id: string) => {
    const itemToDelete = items.find((item) => item.id === id);
    if (!itemToDelete) return;
    showAlert(`确定要删除「${itemToDelete.name}」吗？`, {
      title: "确认删除",
      cancelText: "取消",
      confirmText: "删除",

      onConfirm: async () => {
        deleteItem(id);
        if (editingItem?.id === id) {
          setEditingItem(null);
          setEditModalVisible(false);
        }
      },
    });
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

  const showHeader = false;
  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* <HeaderWithSearch onSearch={(query) => console.log("搜索内容:", query)} /> */}
        {/* <CustomHeader title='零落集' onSearch={(query) => console.log("Search:", query)} /> */}

        <View
          style={[
            styles.header,
            showHeader
              ? {
                  marginTop: 120,
                }
              : {
                  marginTop: 60,
                },
          ]}
        >
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
            onDelete={() => handleItemDelete(editingItem.id)}
            initialData={{
              name: editingItem.name,
              price: editingItem.price,
              purchaseDate: dayjs(editingItem.purchaseDate).toDate(),
              imageUri: editingItem.imageUri,
            }}
          />
        )}

        <AlertDialog
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          type={alertOptions.type}
          confirmText={alertOptions.confirmText}
          onDismiss={hideAlert}
          onConfirm={() => {
            alertOptions.onConfirm?.();
            hideAlert();
          }}
        />
        <DraggableFAB onPress={openAddModal} longPressToCenter={true} />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    // 添加顶部的间距
    height: Dimensions.get("window").height - 100,
  },
});
