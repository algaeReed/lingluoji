// components/Home/ItemCard.tsx
import { Item } from "@/store/itemStore";
import dayjs from "dayjs";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

interface Props {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function ItemForDouble({ item, onEdit, onDelete }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onEdit(item)} onLongPress={() => onDelete(item)}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode='cover' />}

        <Card.Content style={styles.content}>
          <Text variant='titleMedium' numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.priceText}>¥{item.price}</Text>
          <Text style={styles.dateText}>购买日期: {dayjs(item.purchaseDate).format("YYYY-MM-DD")}</Text>
        </Card.Content>

        <View style={styles.actions}>
          <IconButton icon='pencil' size={20} onPress={() => onEdit(item)} />
          <IconButton icon='delete' size={20} onPress={() => onDelete(item)} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    // height: "100%",
  },
  content: {
    paddingVertical: 8,
  },
  image: {
    width: "100%",
    height: 140,
  },
  priceText: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 8,
  },
});
