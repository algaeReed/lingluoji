import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MD3Theme, useTheme } from "react-native-paper";

interface CustomHeaderProps {
  title: string;
  onSearch?: (query: string) => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onSearch }) => {
  const theme: MD3Theme = useTheme();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (searchVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSearchVisible(false));
    } else {
      setSearchVisible(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSearch = () => {
    onSearch?.(searchQuery);
    toggleSearch();
  };

  const headerTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const searchTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <>
      {/* Main Header */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.elevation.level2,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <BlurView intensity={20} tint='systemChromeMaterial' style={StyleSheet.absoluteFill} />
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>{title}</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
              <Ionicons name='search' size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name='ellipsis-vertical' size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Search Overlay */}
      {searchVisible && (
        <Animated.View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.elevation.level3,
              transform: [{ translateY: searchTranslateY }],
            },
          ]}
        >
          <BlurView intensity={30} tint={theme.dark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          <View style={styles.searchContent}>
            <TextInput
              style={[styles.searchInput, { color: theme.colors.onSurface, backgroundColor: theme.colors.surface }]}
              placeholder='搜索...'
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={toggleSearch} style={styles.closeButton}>
              <Ionicons name='close' size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 90 : 60,
    paddingTop: Platform.OS === "ios" ? 30 : 0,
    zIndex: 100,
    overflow: "hidden",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
  },
  searchContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 140 : 110,
    paddingTop: Platform.OS === "ios" ? 30 : 0,
    zIndex: 99,
    overflow: "hidden",
  },
  searchContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    elevation: 2,
  },
  closeButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default CustomHeader;
