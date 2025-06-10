import { Item } from "@/store/itemStore";
import React from "react";
import { Dimensions, RefreshControl, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import ItemForCard from "./ItemForCard";

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
    <FlashList
      data={items}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      estimatedItemSize={600}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.cardContainer}>
          <ItemForCard item={item} onEdit={onEdit} onDelete={onDelete} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width,
    padding: 16,
    height: 600,
  },
});
