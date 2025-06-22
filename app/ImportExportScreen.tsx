import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { Appbar, Button } from "react-native-paper";

import { useExportItems } from "@/hooks/useExportItems";
import { useTheme } from "@/theme/ThemeProvider";

export default function ImportExportScreen() {
  const { theme } = useTheme();
  const { mode, pulseCount } = useLocalSearchParams();
  const validMode = mode === "import" || mode === "export" ? mode : undefined;
  const pulseTimes = typeof pulseCount === "string" ? parseInt(pulseCount) : -1;

  const { importFromJSON, importFromExcel, exportToJSON, exportToExcel, exportTemplateJSON, exportTemplateExcel } =
    useExportItems();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (pulseTimes === -1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else if (pulseTimes > 0) {
      const animations: Animated.CompositeAnimation[] = [];
      for (let i = 0; i < pulseTimes; i++) {
        animations.push(
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        );
      }
      Animated.sequence(animations).start();
    }
  }, [pulseAnim, pulseTimes]);

  const importAnimStyle = validMode === "import" ? { transform: [{ scale: pulseAnim }] } : {};
  const exportAnimStyle = validMode === "export" ? { transform: [{ scale: pulseAnim }] } : {};

  return (
    <ScrollView
    //  contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction color='white' onPress={() => router.back()} />
        <Appbar.Content title='选择主题' titleStyle={{ color: "white" }} />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <View style={styles.innerContainer}>
          {/* 导入标题 */}
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionBar, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>导入</Text>
          </View>
          <View style={styles.buttonGroup}>
            <Animated.View style={[styles.flexButton, importAnimStyle]}>
              <Button mode='outlined' onPress={importFromJSON} contentStyle={styles.buttonContent}>
                导入 JSON
              </Button>
            </Animated.View>
            <Animated.View style={[styles.flexButton, importAnimStyle]}>
              <Button mode='outlined' onPress={importFromExcel} contentStyle={styles.buttonContent}>
                导入 Excel
              </Button>
            </Animated.View>
          </View>
          {/* 导出标题 */}
          <View style={[styles.sectionHeader, { marginTop: 32 }]}>
            <View style={[styles.sectionBar, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>导出</Text>
          </View>
          <View style={styles.buttonGroup}>
            <Animated.View style={[styles.flexButton, exportAnimStyle]}>
              <Button mode='outlined' onPress={exportToJSON} contentStyle={styles.buttonContent}>
                导出为 JSON
              </Button>
            </Animated.View>
            <Animated.View style={[styles.flexButton, exportAnimStyle]}>
              <Button mode='outlined' onPress={exportToExcel} contentStyle={styles.buttonContent}>
                导出为 Excel
              </Button>
            </Animated.View>
          </View>
          <View style={styles.buttonGroup}>
            <Animated.View style={[styles.flexButton, exportAnimStyle]}>
              <Button mode='outlined' onPress={exportTemplateJSON} contentStyle={styles.buttonContent}>
                导出 JSON 模版
              </Button>
            </Animated.View>
            <Animated.View style={[styles.flexButton, exportAnimStyle]}>
              <Button mode='outlined' onPress={exportTemplateExcel} contentStyle={styles.buttonContent}>
                导出 Excel 模版
              </Button>
            </Animated.View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: "transparent",
  },
  innerContainer: {
    gap: 24,
  },
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
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
  },
  flexButton: {
    flex: 1,
    borderRadius: 10,
    // elevation: 2,
  },
  buttonContent: {
    height: 48,
  },
});
