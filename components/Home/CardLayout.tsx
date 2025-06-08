// components/Home/layouts/CardLayout.tsx
import { Item } from "@/store/itemStore";
import React from "react";
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import ItemCard from "./ItemCard";

const { width } = Dimensions.get("window");

interface CardLayoutProps {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function CardLayout({ items, refreshing, onRefresh, onEdit, onDelete }: CardLayoutProps) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.cardContainer}>
          <ItemCard item={item} onEdit={onEdit} onDelete={onDelete} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width,
    padding: 16,
  },
});
