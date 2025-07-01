import { useTheme } from "@/theme/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Animated, LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type Item = {
  id: string;
  name: string;
  price: number;
};

type Props = {
  items?: Item[];
};

export default function SummaryCard({ items = [] }: Props) {
  const { theme } = useTheme();
  const [isContentVisible, setIsContentVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const totalCount = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const toggleVisibility = () => {
    // Configure the animation
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    // Only use Animated for opacity (which supports native driver)
    if (isContentVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    setIsContentVisible(!isContentVisible);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceVariant,
          shadowColor: theme.dark ? "#000" : "#000",
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>汇总</Text>
        <TouchableOpacity onPress={toggleVisibility}>
          <MaterialIcons
            name={isContentVisible ? "visibility-off" : "visibility"}
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
      </View>

      {isContentVisible && (
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>物品总数</Text>
            <Text style={[styles.value, { color: theme.colors.onSurface }]}>{totalCount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>总价格</Text>
            <Text style={[styles.value, { color: theme.colors.onSurface }]}>{totalPrice.toFixed(2)} 元</Text>
          </View>
        </Animated.View>
      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  contentContainer: {
    // LayoutAnimation will handle the height automatically
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
