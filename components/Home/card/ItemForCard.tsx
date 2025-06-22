import BreathingHint from "@/components/BreathingHint/BreathingHint";
import { CARD_HEIGHT, CONTENT_HEIGHT, IMAGE_HEIGHT } from "@/constants/CardLayout";
import { Item } from "@/store/itemStore";
import { getUsageTimeDescription } from "@/utils/getUsageTimeDescription";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { Animated, Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";

interface FlipCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function FlipCard({ item, onEdit, onDelete }: FlipCardProps) {
  const theme = useTheme();
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipToFrontStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const flipToBackStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handleFlip = () => {
    Animated.timing(flipAnim, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = () => {
    onDelete(item);
  };

  const today = dayjs();
  const purchaseDate = dayjs(item.purchaseDate);
  const daysUsed = Math.max(1, today.diff(purchaseDate, "day"));
  const dailyCost = (item.price / daysUsed).toFixed(2);

  return (
    <View style={styles.container}>
      {/* Front Side */}
      <TouchableWithoutFeedback onPress={handleFlip}>
        <Animated.View style={[styles.card, styles.cardFront, flipToFrontStyle]}>
          <Card style={styles.innerCard} mode='contained'>
            {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.image} />}
            <Card.Content style={styles.cardContent}>
              <Text variant='titleMedium' numberOfLines={1}>
                {item.name}
              </Text>
              <Text>总价: ¥{item.price}</Text>
              <Text>日均: ¥{dailyCost}</Text>
              <Text>
                购入: {purchaseDate.format("YYYY-MM-DD")}
                {/* ({daysUsed}天前) */}
              </Text>

              <Text>已过天数: {getUsageTimeDescription(daysUsed)?.text}</Text>
              <BreathingHint />
              {/* <Text style={styles.hint}>点击查看操作</Text> */}
            </Card.Content>
          </Card>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Back Side */}
      <Animated.View
        style={[styles.card, styles.cardBack, flipToBackStyle, { backgroundColor: theme.colors.surfaceVariant }]}
        // 👇 这行确保能响应事件而不会穿透
        pointerEvents='box-none'
      >
        <View style={styles.backMask} pointerEvents='box-none' />
        <View style={styles.actionContent}>
          <Text variant='titleMedium' style={styles.nameCenter}>
            {item.name}
          </Text>
          <Text style={styles.priceText}>¥{item.price}</Text>
          <View style={styles.actionRow}>
            <IconButton icon='pencil' onPress={handleEdit} />
            <IconButton icon='delete' onPress={handleDelete} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: CARD_HEIGHT,
    marginVertical: 12,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  innerCard: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  cardContent: {
    height: CONTENT_HEIGHT,
    justifyContent: "space-between",
  },
  image: {
    height: IMAGE_HEIGHT,
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
  },
  hint: {
    // marginTop: 8,
    // color: "#888",
    // fontSize: 13,
    // textAlign: "center",
  },
  actionContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  nameCenter: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 15,
    color: "#444",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  backMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1,
  },
});
