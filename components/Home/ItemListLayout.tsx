// components/Home/ItemListLayout.tsx
import { Item } from "@/store/itemStore";

import { useSettingsStore } from "@/store/settingsStore";
import React from "react";
import CardLayout from "./card/CardLayout";
import DoubleColumnLayout from "./double/DoubleColumnLayout";
import SingleColumnLayout from "./single/SingleColumnLayout";

interface Props {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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
