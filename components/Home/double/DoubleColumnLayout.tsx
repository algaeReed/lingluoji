// components/Home/layouts/DoubleColumnLayout.tsx
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import ItemCardForDouble from "./ItemForDouble";

// TOODO改为瀑布流
/**
 * 双列布局
 * @param param0
 * @returns
 */
export default function DoubleColumnLayout({ items, refreshing, onRefresh, onEdit, onDelete }: any) {
  return (
    <FlatList
      data={items}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={{ flex: 1, margin: 6 }}>
          <ItemCardForDouble item={item} onEdit={onEdit} onDelete={onDelete} />
        </View>
      )}
    />
  );
}
