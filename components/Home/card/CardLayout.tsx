import { Item } from "@/store/itemStore";
import React, { useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import ItemForCard from "./ItemForCard";

import { animatedStyles2, scrollInterpolator2 } from "./interpolators";

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

  const [searchTerm, setSearchTerm] = useState("");
  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder='Search items...'
          placeholderTextColor='#999'
          value={searchTerm}
          onChangeText={setSearchTerm}
          clearButtonMode='while-editing'
        />
      </View>

      {/* Search results count */}
      {searchTerm && (
        <View style={styles.resultsCount}>
          <Text style={styles.resultsText}>
            {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"} found
          </Text>
        </View>
      )}

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
          slideInterpolatedStyle={animatedStyles2}
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
  searchContainer: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  resultsCount: {
    padding: 10,
    alignItems: "center",
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
  },
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
