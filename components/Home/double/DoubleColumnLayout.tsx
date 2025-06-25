// components/Home/layouts/DoubleColumnLayout.tsx
import { Item } from "@/store/itemStore";
import MasonryList from "@react-native-seoul/masonry-list";
import React from "react";
import { View } from "react-native";
import ItemCardForDouble from "./ItemForDouble";

interface Props {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DoubleColumnLayout({ items, refreshing, onRefresh, onEdit, onDelete }: Props) {
  return (
    <MasonryList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12 }}
      renderItem={({ item }) => {
        const typedItem = item as Item;
        return (
          // <View style={{ margin: 6 }}>
          <View
            style={{
              margin: 6,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
          >
            <ItemCardForDouble item={typedItem} onEdit={onEdit} onDelete={onDelete} />
          </View>
        );
      }}
    />
  );
}
