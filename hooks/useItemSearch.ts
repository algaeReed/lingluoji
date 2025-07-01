// hooks/useItemSearch.ts
import { Item } from "@/store/itemStore";
import { useMemo, useState } from "react";

export default function useItemSearch(items: Item[]) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [items, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}
