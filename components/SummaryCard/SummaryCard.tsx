import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

type Item = {
  id: string;
  name: string;
  price: number;
};

type Props = {
  items: Item[];
};

export default function SummaryCard({ items }: Props) {
  const theme = useTheme();

  const totalCount = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceVariant,
          shadowColor: theme.dark ? "#000" : "#000", // 可选：暗色模式下阴影颜色保持一致
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>汇总</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>物品总数</Text>
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>{totalCount}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>总价格</Text>
        <Text style={[styles.value, { color: theme.colors.onSurface }]}>{totalPrice.toFixed(2)} 元</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
