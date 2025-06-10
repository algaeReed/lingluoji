import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSettingsStore } from "@/store/settingsStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const showTabBar = useSettingsStore((state) => state.showTabBar);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: [
          { display: showTabBar ? "flex" : "none" },
          Platform.select({
            ios: {
              position: "absolute",
              backgroundColor: "transparent",
              borderTopWidth: 0.5,
              borderColor: "rgba(0,0,0,0.1)",
              elevation: 0,
            },
            android: {
              backgroundColor: "rgba(255,255,255,0.9)",
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
          tabBarIcon: ({ color }) => <IconSymbol name='paperplane.fill' size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <IconSymbol name='person.crop.circle.fill' size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
