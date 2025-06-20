import { Item } from "@/store/itemStore";
import React, { useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import ItemForCard from "./ItemForCard";

const { width } = Dimensions.get("window");

interface CardLayoutProps {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export default function CardLayout({ items, refreshing, onRefresh, onEdit, onDelete }: CardLayoutProps) {
  const carouselRef = useRef<Carousel<Item>>(null);

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        layout='tinder'
        ref={carouselRef}
        data={items}
        sliderWidth={width}
        itemWidth={width}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <ItemForCard item={item} onEdit={onEdit} onDelete={onDelete} />
          </View>
        )}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        enableMomentum={true}
        lockScrollWhileSnapping={true}
        // 可以打开下面两行实现分页效果
        pagingEnabled={true}
        // loop={false} // 根据需要设置是否循环
      />
      {/* RefreshControl 不能直接给 Carousel，需要包在外层 ScrollView */}
      {/* 这里给用户一个可拉动刷新的简单示例 */}
      {refreshing && <View style={styles.refreshOverlay}>{/* 可以做一个刷新loading提示 */}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width,
    padding: 16,
    height: 600,
    // borderWidth: 1,
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
