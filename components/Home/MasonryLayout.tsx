// components/Home/layouts/MasonryLayout.tsx
import { Item } from "@/store/itemStore";
import MasonryList from "@react-native-seoul/masonry-list";
import React from "react";
import ItemCard from "./ItemForCard";
interface Props {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function MasonryLayout({ items, onEdit, onDelete }: Props) {
  return (
    <>
      <MasonryList
        data={items}
        keyExtractor={(item: Item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <ItemCard item={item as Item} onEdit={onEdit} onDelete={onDelete} />}
        style={{ padding: 12 }}
      />
    </>
  );
}
