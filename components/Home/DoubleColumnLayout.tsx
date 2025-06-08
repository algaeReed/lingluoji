// components/Home/layouts/DoubleColumnLayout.tsx
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";
import ItemCard from "./ItemCard";

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
          <ItemCard item={item} onEdit={onEdit} onDelete={onDelete} />
        </View>
      )}
    />
  );
}
