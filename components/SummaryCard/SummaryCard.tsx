import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";

type Item = {
  id: string;
  name: string;
  price: number;
};

type Props = {
  items: Item[];
};

export default function SummaryCard({ items }: Props) {
  const totalCount = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const isDark = useColorScheme() === "dark";

  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>汇总</Text>

      <View style={styles.row}>
        <Text style={[styles.label, isDark && styles.labelDark]}>物品总数</Text>
        <Text style={[styles.value, isDark && styles.valueDark]}>{totalCount}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, isDark && styles.labelDark]}>总价格</Text>
        <Text style={[styles.value, isDark && styles.valueDark]}>{totalPrice.toFixed(2)} 元</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardDark: {
    backgroundColor: "#1e1e1e",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  titleDark: {
    color: "#ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  labelDark: {
    color: "#aaa",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  valueDark: {
    color: "#fff",
  },
});
