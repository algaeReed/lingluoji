import { Item } from "@/store/itemStore";
import dayjs from "dayjs";
import React, { useRef } from "react";
import { Animated, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Card, IconButton, useTheme } from "react-native-paper";

interface Props {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const FlipCard: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  const theme = useTheme();

  const flipAnimation = useRef(new Animated.Value(0)).current;
  let flipRotation = 0;
  flipAnimation.addListener(({ value }) => (flipRotation = value));

  const flipToFrontStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const flipToBackStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  const flipCard = () => {
    if (flipRotation >= 90) {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(flipAnimation, {
        toValue: 180,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleEdit = () => {
    flipCard();
    setTimeout(() => onEdit(item), 500);
  };

  const handleDelete = () => {
    flipCard();
    setTimeout(() => onDelete(item), 500);
  };

  const purchaseDate = dayjs(item.purchaseDate);
  const daysUsed = Math.max(1, dayjs().diff(purchaseDate, "day"));
  const dailyPrice = item.price / daysUsed;

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={flipCard}>
        <View>
          <Animated.View style={[styles.card, styles.cardFront, flipToFrontStyle, { backfaceVisibility: "hidden" }]}>
            <Card
              style={[
                styles.card,
                styles.cardFront,
                flipToFrontStyle,
                { backfaceVisibility: "hidden" },
                { backgroundColor: theme.colors.surface },
              ]}
            >
              {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.cardImage} resizeMode='cover' />}
              <Card.Content style={styles.cardContent}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.totalPrice}>¥{item.price.toFixed(2)}</Text>
                  <Text style={styles.dailyPrice}>(¥{dailyPrice.toFixed(2)}/天)</Text>
                </View>
                <View style={styles.dateRow}>
                  <Text style={styles.dateText}>购买: {purchaseDate.format("YYYY-MM-DD")}</Text>
                  <Text style={styles.dateText}>已用: {daysUsed}天</Text>
                </View>
              </Card.Content>
              <Text style={styles.hintText}>点击查看操作</Text>
            </Card>
          </Animated.View>

          {/* Back Side */}
          <Animated.View style={[styles.card, styles.cardBack, flipToBackStyle, { backfaceVisibility: "hidden" }]}>
            <IconButton icon='close' style={styles.backButton} onPress={flipCard} />
            <View style={styles.backContent}>
              <Text style={styles.backName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.backPrice}>¥{item.price.toFixed(2)}</Text>
              <Text style={styles.backDays}>已使用 {daysUsed} 天</Text>
            </View>
            <View style={styles.actionButtons}>
              <IconButton icon='pencil' style={styles.editButton} onPress={handleEdit} />
              <IconButton icon='delete' style={styles.deleteButton} onPress={handleDelete} />
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "88%",
    width: "100%",
    perspective: "1000px",
  },
  card: {
    height: "100%",
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 4,
    overflow: "hidden",
  },
  cardFront: {
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
  },
  cardBack: {
    width: "100%",
    backgroundColor: "#f8f8f8",
  },
  cardImage: {
    height: 160,
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "red",
    marginRight: 8,
  },
  dailyPrice: {
    fontSize: 14,
    color: "grey",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 14,
    color: "grey",
  },
  hintText: {
    textAlign: "center",
    color: "grey",
    padding: 16,
    marginTop: "auto",
  },
  backButton: {
    alignSelf: "flex-end",
    margin: 8,
  },
  backContent: {
    alignItems: "center",
    padding: 16,
    flex: 1,
    justifyContent: "center",
  },
  backName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  backPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
    marginBottom: 8,
  },
  backDays: {
    fontSize: 16,
    color: "grey",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  editButton: {
    backgroundColor: "#f0f0f0",
    marginHorizontal: 8,
  },
  deleteButton: {
    backgroundColor: "#ffebee",
    marginHorizontal: 8,
  },
});

export default FlipCard;
