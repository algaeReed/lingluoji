import BreathingHint from "@/components/BreathingHint/BreathingHint";
import { CARD_HEIGHT, CONTENT_HEIGHT, IMAGE_HEIGHT } from "@/constants/CardLayout";
import { Item } from "@/store/itemStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/theme/ThemeProvider";
import { getUsageTimeDescription } from "@/utils/getUsageTimeDescription";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { Animated, ImageBackground, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";

interface FlipCardProps {
  item: Item;
  onEdit: (item: string) => void;
  onDelete: (item: string) => void;
}

export default function FlipCard({ item, onEdit, onDelete }: FlipCardProps) {
  const isShort = useSettingsStore((state) => state.isShort);
  const forceType = useSettingsStore((state) => state.forceType);

  const { theme } = useTheme();
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

  const handleEdit = (id: string) => {
    if (!flipped) return;
    onEdit(id);
  };

  const handleDelete = (id: string) => {
    if (!flipped) return;
    onDelete(id);
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
            <ImageBackground source={{ uri: item.imageUri }} style={styles.image} resizeMode='cover'>
              <Card.Content
                style={[
                  item.imageUri
                    ? [
                        styles.cardContent,
                        {
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                        },
                      ]
                    : styles.cardContentWithoutImage,
                ]}
              >
                <View>
                  <Text
                    variant='titleMedium'
                    numberOfLines={1}
                    style={{ fontSize: 20, color: theme.colors.primary, textAlign: "center", lineHeight: 30 }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.colors.primary, textAlign: "center", lineHeight: 20 }}>
                    总价: ¥{item.price} ~ 日均: ¥{dailyCost}
                  </Text>

                  <Text style={{ fontSize: 12, color: theme.colors.primary, textAlign: "center", lineHeight: 20 }}>
                    购入: {purchaseDate.format("YYYY-MM-DD")} ~ 已过天数:
                    {getUsageTimeDescription(daysUsed, forceType, isShort)?.text}
                  </Text>
                </View>
                <BreathingHint
                  textStyle={{
                    color: theme.colors.primary,
                  }}
                />
              </Card.Content>
            </ImageBackground>
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
            <IconButton
              icon='pencil'
              onPress={() => {
                handleEdit(item.id);
              }}
            />
            <IconButton
              icon='delete'
              onPress={() => {
                handleDelete(item.id);
              }}
            />
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
    // padding: 12,
    justifyContent: "space-between",
  },
  image: {
    height: CARD_HEIGHT,
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "flex-end",
  },

  cardContent: {
    height: CONTENT_HEIGHT - 24,
    justifyContent: "space-between",

    padding: 12,
  },
  cardContentWithoutImage: {
    height: CONTENT_HEIGHT + IMAGE_HEIGHT,
    justifyContent: "space-around",
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
