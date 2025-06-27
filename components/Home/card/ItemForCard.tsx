import BreathingHint from "@/components/BreathingHint/BreathingHint";
import { CARD_HEIGHT, CONTENT_HEIGHT, IMAGE_HEIGHT } from "@/constants/CardLayout";
import { Item } from "@/store/itemStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/theme/ThemeProvider";
import { getUsageTimeDescription } from "@/utils/getUsageTimeDescription";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { Animated, ImageBackground, Pressable, StyleSheet, Vibration, View } from "react-native";
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
    Vibration.vibrate(10);
    Animated.timing(flipAnim, {
      toValue: flipped ? 0 : 180,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped));
  };

  const handleEdit = () => {
    onEdit(item.id);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  const today = dayjs();
  const purchaseDate = dayjs(item.purchaseDate);
  const daysUsed = Math.max(1, today.diff(purchaseDate, "day"));
  const dailyCost = (item.price / daysUsed).toFixed(2);

  return (
    <View style={styles.container}>
      {/* Front Card */}
      <Animated.View style={[styles.card, styles.cardFront, flipToFrontStyle, { zIndex: flipped ? 1 : 2 }]}>
        <Pressable onPress={handleFlip} style={{ flex: 1 }}>
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
        </Pressable>
      </Animated.View>

      {/* Back Card */}
      <Animated.View
        style={[
          styles.card,
          styles.cardBack,
          flipToBackStyle,
          {
            backgroundColor: theme.colors.surfaceVariant,
            zIndex: flipped ? 2 : 1,
          },
        ]}
      >
        <View style={styles.backContent}>
          {/* 背面翻转区域 - 覆盖整个卡片但避开操作按钮 */}
          <Pressable onPress={handleFlip} style={styles.flipBackPressable} />

          <ImageBackground source={{ uri: item.imageUri }} style={styles.backImage} resizeMode='cover'>
            <Card.Content
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
                  style={item.imageUri ? styles.avatar : { display: "none" }}
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
                  <IconButton icon='pencil' onPress={handleEdit} style={styles.actionButton} />
                  <IconButton icon='delete' onPress={handleDelete} style={styles.actionButton} />
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
    alignItems: "center",
    justifyContent: "center",
  },
  backContent: {
    width: "100%",
    height: "100%",
    position: "relative",
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
    zIndex: 3, // 确保按钮在最上层
  },
  actionButton: {
    marginHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 3, // 确保按钮在最上层
  },
  flipBackPressable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 80, // 留出底部空间给操作按钮
    zIndex: 2,
  },

  // Shared styles
  cardContentWithoutImage: {
    height: CONTENT_HEIGHT + IMAGE_HEIGHT,
    justifyContent: "space-around",
  },
});
