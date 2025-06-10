// components/Home/ItemListLayout.tsx
import { Item } from "@/store/itemStore";
import { useSettingsStore } from "@/store/settingsStore";
import React from "react";
import CardLayout from "./CardLayout";
import DoubleColumnLayout from "./DoubleColumnLayout";
import SingleColumnLayout from "./SingleColumnLayout";

interface Props {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function ItemListLayout(props: Props) {
  const { layoutMode } = useSettingsStore();

  switch (layoutMode) {
    case "singleColumn":
      return <SingleColumnLayout {...props} />;
    case "doubleColumn":
      return <DoubleColumnLayout {...props} />;
    default:
      return <CardLayout {...props} />;
  }
}
