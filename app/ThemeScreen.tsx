import { useSettingsStore } from "@/store/settingsStore";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { RadioButton, Text, useTheme } from "react-native-paper";

export default function ThemeScreen() {
  const theme = useTheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const themeOptions = useSettingsStore((state) => state.themeOptions);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.section}>
        <Text variant='titleMedium' style={styles.sectionTitle}>
          选择主题
        </Text>
        <RadioButton.Group onValueChange={(value) => setThemeMode(value as typeof themeMode)} value={themeMode}>
          {themeOptions.map(({ label, value }) => (
            <View key={value} style={styles.radioRow}>
              <RadioButton value={value} />
              <Text style={styles.radioLabel}>{label}</Text>
            </View>
          ))}
        </RadioButton.Group>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
});
