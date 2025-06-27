import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/theme/ThemeProvider"; // ✅ 引入 Paper 主题
export default function TabLayout() {
  const { theme } = useTheme(); // ✅ 获取当前主题
  const showTabBar = useSettingsStore((state) => state.showTabBar);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary, // ✅ 使用主题颜色
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant, // 推荐设置
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: [
          { display: showTabBar ? "flex" : "none" },
          Platform.select({
            ios: {
              position: "absolute",
              backgroundColor: "transparent", // 透明背景交给 TabBarBackground 控制
              borderTopWidth: 0.5,
              borderColor: theme.colors.outlineVariant, // ✅ 用主题色
              elevation: 0,
            },
            android: {
              backgroundColor: theme.colors.surface, // ✅ 用主题色
            },
          }),
        ],
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol name='house.fill' size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: "Explore",
          // href: null, // ✅ 不出现在底部导航/
          tabBarIcon: ({ color }) => <IconSymbol name='paperplane.fill' size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <IconSymbol name='paperplane.fill' size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
