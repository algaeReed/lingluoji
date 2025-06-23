import LayoutSwitcher from "@/components/LayoutSwitcher/LayoutSwitcher";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/theme/ThemeProvider";
import { router, Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, RadioButton, Text, TouchableRipple } from "react-native-paper";

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
        <Appbar.Content title='外观' titleStyle={{ color: "white" }} />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <View style={styles.section}>
          <Text variant='titleMedium' style={styles.sectionTitle}>
            选择主题
          </Text>
          <RadioButton.Group onValueChange={(value) => setThemeMode(value as typeof themeMode)} value={themeMode}>
            {themeOptions.map(({ label, value }) => (
              <TouchableRipple
                key={value}
                onPress={() => setThemeMode(value as typeof themeMode)}
                rippleColor='rgba(0, 0, 0, .1)'
              >
                <View style={styles.radioRow}>
                  <RadioButton value={value} />
                  <Text style={styles.radioLabel}>{label}</Text>
                </View>
              </TouchableRipple>
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
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
});
