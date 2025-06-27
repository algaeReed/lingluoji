import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

export default function SectionTitle({ title }: { title: string }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.sectionHeader, { marginTop: 8, marginBottom: 8 }]}>
      <View style={[styles.sectionBar, { backgroundColor: theme.colors.primary }]} />
      <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
});
