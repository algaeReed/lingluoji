import { useItemsStore } from "@/store/itemStore";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, ProgressBar, TextInput, useTheme } from "react-native-paper";

export default function TabTwoScreen() {
  const theme = useTheme();
  const { clearAllItems, generateTestData } = useItemsStore();

  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [amount, setAmount] = useState("1000");

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
  },
  innerContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: "transparent",
  },
  progress: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
});
