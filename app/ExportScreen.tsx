import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

import { useExportItems } from "@/hooks/useExportItems";

export default function ExportScreen() {
  const theme = useTheme();
  const { exportToJSON, exportToExcel, exportTemplateJSON, exportTemplateExcel } = useExportItems();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.innerContainer}>
        <View style={styles.buttonGroup}>
          <Button mode='outlined' onPress={exportToJSON} style={styles.flexButton} contentStyle={styles.buttonContent}>
            导出为 JSON
          </Button>
          <Button mode='outlined' onPress={exportToExcel} style={styles.flexButton} contentStyle={styles.buttonContent}>
            导出为 Excel
          </Button>
        </View>
        <View style={styles.buttonGroup}>
          <Button
            mode='outlined'
            onPress={exportTemplateJSON}
            style={styles.flexButton}
            contentStyle={styles.buttonContent}
          >
            导出 JSON 模版
          </Button>
          <Button
            mode='outlined'
            onPress={exportTemplateExcel}
            style={styles.flexButton}
            contentStyle={styles.buttonContent}
          >
            导出 Excel 模版
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: "transparent",
  },
  innerContainer: {
    gap: 24,
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
    elevation: 2,
  },
  buttonContent: {
    height: 48,
  },
});
