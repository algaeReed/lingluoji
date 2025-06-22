import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

import { useExportItems } from "@/hooks/useExportItems";

export default function ImportScreen() {
  const theme = useTheme();
  const { importFromJSON, importFromExcel } = useExportItems();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.innerContainer}>
        <View style={styles.buttonGroup}>
          <Button
            mode='outlined'
            onPress={importFromJSON}
            style={styles.flexButton}
            contentStyle={styles.buttonContent}
          >
            导入 JSON
          </Button>
          <Button
            mode='outlined'
            onPress={importFromExcel}
            style={styles.flexButton}
            contentStyle={styles.buttonContent}
          >
            导入 Excel
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
