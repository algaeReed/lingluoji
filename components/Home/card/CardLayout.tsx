import { Item } from "@/store/itemStore";
import React, { useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import ItemForCard from "../single/ItemForCard";

import { animatedStyles2, scrollInterpolator2 } from "./interpolators";

const { width } = Dimensions.get("window");

interface CardLayoutProps {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}
/**
 * 卡片模式布局
 * @param param0
 * @returns
 */
export default function CardLayout({ items, refreshing, onRefresh, onEdit, onDelete }: CardLayoutProps) {
  const carouselRef = useRef<Carousel<Item>>(null);

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={carouselRef}
        data={items}
        sliderWidth={width}
        itemWidth={width * 0.75} // 模板2中item宽度可以适当小一点，显示重叠效果更明显
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <ItemForCard item={item} onEdit={onEdit} onDelete={onDelete} />
          </View>
        )}
        scrollInterpolator={scrollInterpolator2}
        slideInterpolatedStyle={animatedStyles2}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        enableMomentum={true}
        lockScrollWhileSnapping={true}
        // 可根据需求打开
        // pagingEnabled={true}
        // loop={false}
      />
      {refreshing && <View style={styles.refreshOverlay}>{/* 刷新loading提示 */}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.75,
    padding: 16,
    height: 600,
  },
  refreshOverlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 600,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
});
