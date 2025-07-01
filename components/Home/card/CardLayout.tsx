import useItemSearch from "@/hooks/useItemSearch";
import { Item } from "@/store/itemStore";
import React, { useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import ItemForCard from "./ItemForCard";
import SearchBar from "./SearchBar"; // Import the new component

import { scrollInterpolator2 } from "./interpolators";

const { width } = Dimensions.get("window");

interface CardLayoutProps {
  items: Item[];
  refreshing: boolean;
  onRefresh: () => void;
  onEdit: (item: string) => void;
  onDelete: (item: string) => void;
}

/**
 * 卡片模式布局 with search functionality
 * @param param0
 * @returns
 */
export default function CardLayout({ items, refreshing, onRefresh, onEdit, onDelete }: CardLayoutProps) {
  const carouselRef = useRef<Carousel<Item>>(null);
  const { searchTerm, setSearchTerm, filteredItems } = useItemSearch(items);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} resultsCount={filteredItems.length} />

      {/* Carousel */}
      {filteredItems.length > 0 ? (
        <Carousel
          ref={carouselRef}
          data={filteredItems}
          sliderWidth={width}
          itemWidth={width * 0.75}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <ItemForCard item={item} onEdit={onEdit} onDelete={onDelete} />
            </View>
          )}
          scrollInterpolator={scrollInterpolator2}
          slideInterpolatedStyle={animatedStyles2} //暂时不知道影响什么 // 卡片样式
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          enableMomentum={true}
          lockScrollWhileSnapping={true}
        />
      ) : (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>{searchTerm ? "No items match your search" : "No items available"}</Text>
        </View>
      )}

      {refreshing && <View style={styles.refreshOverlay}>{/* 刷新loading提示 */}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  noResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    color: "#999",
  },
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
