import BreathingHint from "@/components/BreathingHint/BreathingHint";
import { CARD_HEIGHT, CONTENT_HEIGHT, IMAGE_HEIGHT } from "@/constants/CardLayout";
import { Item } from "@/store/itemStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/theme/ThemeProvider";
import { getUsageTimeDescription } from "@/utils/getUsageTimeDescription";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { Animated, ImageBackground, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Avatar, Card, IconButton, Text } from "react-native-paper";

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
      <TouchableWithoutFeedback onPress={handleFlip}>
        <Animated.View style={[styles.card, styles.cardFront, flipToFrontStyle]}>
          <Card style={styles.innerCard} mode='contained'>
            <ImageBackground source={{ uri: item.imageUri }} style={styles.frontImage} resizeMode='cover'>
              <Card.Content
                style={[
                  item.imageUri
                    ? [styles.frontCardContent, { backgroundColor: "rgba(255, 255, 255, 0.5)" }]
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

      <Animated.View
        style={[styles.card, styles.cardBack, flipToBackStyle, { backgroundColor: theme.colors.surfaceVariant }]}
        pointerEvents='box-none'
      >
        <View style={styles.backMask} pointerEvents='box-none' />
        <View style={styles.actionContent} pointerEvents='box-none'>
          <ImageBackground
            source={{ uri: item.imageUri }}
            style={styles.backImage}
            resizeMode='cover'
            pointerEvents='box-none'
            {...({ pointerEvents: "box-none" } as any)} // 强制类型断言
          >
            <Card.Content
              pointerEvents='box-none'
              style={[
                item.imageUri
                  ? [styles.backCardContent, { backgroundColor: "rgba(255, 255, 255, 0.6)" }]
                  : styles.cardContentWithoutImage,
              ]}
            >
              <View style={styles.backContentContainer}>
                <Avatar.Image
                  size={96}
                  source={{ uri: item.imageUri || "https://via.placeholder.com/150" }}
                  style={[
                    item.imageUri
                      ? styles.avatar
                      : {
                          display: "none",
                        },
                  ]}
                />
                <Text
                  variant='titleMedium'
                  style={{ fontSize: 20, color: theme.colors.primary, textAlign: "center", lineHeight: 30 }}
                >
                  {item.name}
                </Text>
                <Text style={{ fontSize: 12, color: theme.colors.primary, textAlign: "center", lineHeight: 20 }}>
                  总价: ¥{item.price} ~ 日均: ¥{dailyCost}
                </Text>
                <View style={styles.actionRow}>
                  <IconButton icon='pencil' onPress={() => handleEdit(item.id)} />
                  <IconButton icon='delete' onPress={() => handleDelete(item.id)} />
                </View>
              </View>
            </Card.Content>
          </ImageBackground>
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

  // Front styles
  cardFront: {
    zIndex: 2,
  },
  innerCard: {
    flex: 1,
  },
  frontImage: {
    height: CARD_HEIGHT,
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "flex-end",
  },
  frontCardContent: {
    height: CONTENT_HEIGHT - 24,
    justifyContent: "space-between",
    padding: 12,
  },

  // Back styles
  cardBack: {
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  backMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  actionContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  backImage: {
    height: CARD_HEIGHT,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backCardContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    padding: 12,
  },
  backContentContainer: {
    height: CONTENT_HEIGHT,
    justifyContent: "center",
  },
  avatar: {
    alignSelf: "center",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },

  // Shared styles
  cardContentWithoutImage: {
    height: CONTENT_HEIGHT + IMAGE_HEIGHT,
    justifyContent: "space-around",
  },
});
