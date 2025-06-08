import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, ProgressBar, RadioButton, Text, TextInput, useTheme } from "react-native-paper";

import { useItemsStore } from "@/store/itemStore";
import { ThemeMode, useSettingsStore } from "@/store/settingsStore";

import LayoutSwitcher from "@/components/LayoutSwitcher/LayoutSwitcher";
import { useExportItems } from "@/hooks/useExportItems";

// 在组件函数内
export default function TabTwoScreen() {
  const theme = useTheme();
  const { clearAllItems, generateTestData } = useItemsStore();

  const { exportToJSON, exportToExcel, importFromExcel, importFromJSON, exportTemplateJSON, exportTemplateExcel } =
    useExportItems();

  const showTabBar = useSettingsStore((state) => state.showTabBar);
  const setShowTabBar = useSettingsStore((state) => state.setShowTabBar);

  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const themeOptions = useSettingsStore((state) => state.themeOptions);

  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [amount, setAmount] = useState("100");

  const handleClear = () => {
    Alert.alert("确认清除", "确定要清空所有数据吗？此操作不可恢复。", [
      { text: "取消", style: "cancel" },
      {
        text: "确定",
        onPress: async () => {
          try {
            await clearAllItems();
            Alert.alert("操作成功", "所有数据已清除");
          } catch (e) {
            Alert.alert("错误", "清除数据失败：" + (e as Error).message);
          }
        },
      },
    ]);
  };

  const handleGenerate = async () => {
    const count = parseInt(amount, 10);
    if (isNaN(count) || count <= 0) {
      Alert.alert("无效数量", "请输入一个正整数");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    try {
      await generateTestData(count, (current, total) => {
        setProgress(current / total);
      });
      Alert.alert("生成成功", `已生成 ${count} 条测试数据`);
    } catch (e) {
      Alert.alert("错误", "写入数据失败：" + (e as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.innerContainer}>
        <View>
          <Text style={{ marginBottom: 8 }}>选择主题</Text>
          <RadioButton.Group onValueChange={(newValue) => setThemeMode(newValue as ThemeMode)} value={themeMode}>
            {themeOptions.map(({ label, value }) => (
              <View key={value} style={styles.radioRow}>
                <RadioButton value={value} />
                <Text>{label}</Text>
              </View>
            ))}
          </RadioButton.Group>
        </View>
        <TextInput
          label='生成条数'
          value={amount}
          onChangeText={setAmount}
          keyboardType='numeric'
          mode='outlined'
          style={styles.input}
        />
        {isGenerating && <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progress} />}
        <Button mode='outlined' onPress={handleClear} style={styles.button} contentStyle={styles.buttonContent}>
          清除所有数据
        </Button>
        <Button
          mode='contained-tonal'
          onPress={handleGenerate}
          style={styles.button}
          contentStyle={styles.buttonContent}
          loading={isGenerating}
          disabled={isGenerating}
        >
          生成测试数据
        </Button>
        <LayoutSwitcher />
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
        {/* 导入按钮组 */}
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
        <Button
          mode='outlined'
          onPress={() => setShowTabBar(!showTabBar)}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {showTabBar ? "隐藏底部栏" : "显示底部栏"}
        </Button>{" "}
        <Button
          mode='outlined'
          onPress={() => setShowTabBar(!showTabBar)}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {showTabBar ? "隐藏底部栏" : "显示底部栏"}
        </Button>{" "}
        <Button
          mode='outlined'
          onPress={() => setShowTabBar(!showTabBar)}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {showTabBar ? "隐藏底部栏" : "显示底部栏"}
        </Button>
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
    backgroundColor: "transparent", // 这里让背景色由theme控制
  },
  innerContainer: {
    gap: 24, // 增大间距让布局更舒展
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // 增加点间距，避免挤在一起
    marginBottom: 12,
  },
  input: {
    backgroundColor: "transparent",
    fontSize: 16,
    paddingVertical: 6,
  },
  progress: {
    height: 8,
    borderRadius: 4,
    marginVertical: 12, // 上下间距更合理
  },
  button: {
    borderRadius: 10,
    marginTop: 8,
    elevation: 2, // 加点阴影，立体感更强
  },
  buttonContent: {
    height: 48,
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
});
