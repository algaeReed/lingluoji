import LayoutSwitcher from "@/components/LayoutSwitcher/LayoutSwitcher";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/theme/ThemeProvider";
import { router, Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, RadioButton, Text } from "react-native-paper";

export default function ThemeScreen() {
  const { theme } = useTheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const themeOptions = useSettingsStore((state) => state.themeOptions);

  return (
    <ScrollView
    // contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction
          color='white'
          onPress={() => router.back()}
          // disabled={isLoading}
        />
        <Appbar.Content title='选择主题' titleStyle={{ color: "white" }} />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <View style={styles.section}>
          <Text variant='titleMedium' style={styles.sectionTitle}>
            外观
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

        <Text variant='titleMedium' style={styles.sectionTitle}>
          布局模式
        </Text>
        <LayoutSwitcher />
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
