import type { Item } from "@/store/itemStore";
import { useTheme } from "@/theme/ThemeProvider";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Avatar, Card } from "react-native-paper";

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { theme } = useTheme();
  const days = item.dailyPrices?.length || 0;
  const avgPrice = days > 0 ? item.price / days : 0;

  return (
    <View style={styles.rowFront}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={3}>
        <View style={styles.cardContent}>
          {item.imageUri ? (
            <Card.Cover source={{ uri: item.imageUri }} style={styles.cardImage} />
          ) : (
            <Avatar.Icon
              icon='image-off-outline'
              size={56}
              style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.backdrop }]}
            />
          )}
          <View style={styles.infoContainer}>
            <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>{item.name}</Text>
            <Text style={[styles.itemDate, { color: theme.colors.secondary }]}>购买日期: {item.purchaseDate}</Text>
            <Text style={[styles.priceText, { color: theme.colors.onSurface }]}>总价格: ¥{item.price.toFixed(2)}</Text>
            <Text style={[styles.avgPriceText, { color: theme.colors.primary }]}>日均价格: ¥{avgPrice.toFixed(2)}</Text>
            <Text style={[styles.dayCountText, { color: theme.colors.secondary }]}>已过天数: {days} 天</Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  cardImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  avatarPlaceholder: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 13,
  },
  priceText: {
    fontWeight: "600",
    marginTop: 4,
  },
  avgPriceText: {
    fontSize: 13,
    marginTop: 4,
  },
  dayCountText: {
    fontSize: 13,
    marginTop: 2,
  },
  rowFront: {
    backgroundColor: "transparent",
    // paddingHorizontal: 16,
    // marginVertical: 8,
    // borderWidth: 1,
  },
});
