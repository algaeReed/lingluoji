import { Item } from "@/store/itemStore";
import { useTheme } from "@/theme/ThemeProvider";
import React, { useEffect, useState } from "react";
import { FlatList, Animated as RNAnimated, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import ItemCard from "./ItemCard";
import { SwipeableRow } from "./SwipeableRow";

interface ItemListProps {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
/**
 * 单列布局
 * @param param0
 * @returns
 */
export default function SingleColumnLayout({ items, refreshing, onRefresh, onEdit, onDelete }: ItemListProps) {
  // export default function SingleColumnLayout() {

  const showToastFlag = false; //调试 显示toast
  const { theme } = useTheme();
  const [deletingId, setDeletingId] = useState(null);

  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);

  useEffect(() => {
    if (toastText !== null) {
      const timer = setTimeout(() => setToastText(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [toastText]);

  const handleRequestDelete = (id: string) => {
    onDelete(id);
    setDeletingId(null);
  };

  const hdonEdit = (id: string) => {
    onEdit(id);
  };

  const showToast = (msg: string) => {
    showToastFlag && setToastText(msg);
  };

  const renderItem = ({ item }: { item: (typeof items)[0] }) => (
    <SwipeableRow
      itemHeight={120} // custom height
      id={item.id}
      onRequestDelete={handleRequestDelete}
      onEdit={hdonEdit}
      openRowId={openRowId}
      setOpenRowId={setOpenRowId}
      showToast={showToast}
      isDeleting={deletingId === item.id}
      editButtonColor={theme.colors.primary}
      deleteButtonColor={theme.colors.error}
      renderEditButton={() => (
        <Text style={{ color: theme.colors.onPrimary, fontWeight: "bold", fontSize: 16 }}>编辑</Text>
      )}
      renderDeleteButton={() => (
        <Text style={{ color: theme.colors.onError, fontWeight: "bold", fontSize: 16 }}>删除</Text>
      )}
    >
      <ItemCard item={item} />
    </SwipeableRow>
  );

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1, paddingTop: 50, backgroundColor: theme.colors.background }}>
        <FlatList data={items} keyExtractor={(item) => item.id} renderItem={renderItem} />
        {toastText && <Toast message={toastText} />}
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

function Toast({ message }: { message: string }) {
  const opacity = React.useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      RNAnimated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }, 1000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <RNAnimated.View
      style={{
        position: "absolute",
        bottom: 80,
        left: 50,
        right: 50,
        backgroundColor: "rgba(0,0,0,0.7)",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <Text style={{ color: "white", fontSize: 14 }}>{message}</Text>
    </RNAnimated.View>
  );
}
