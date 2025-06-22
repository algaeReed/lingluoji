import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/theme/ThemeProvider";
import { getUsageTimeDescription, UsageTimeType } from "@/utils/getUsageTimeDescription";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Card, RadioButton, Switch, Text, TextInput } from "react-native-paper";

export default function UsageFormatterPage() {
  const [days, setDays] = useState("420");
  const { theme } = useTheme();

  // 从store读取forceType, setForceType, isShort, setIsShort
  const isShort = useSettingsStore((state) => state.isShort);
  const setIsShort = useSettingsStore((state) => state.setIsShort);

  const forceType = useSettingsStore((state) => state.forceType);
  const setForceType = useSettingsStore((state) => state.setForceType);

  const parsedDays = useMemo(() => {
    const val = parseFloat(days);
    return isNaN(val) ? 0 : val;
  }, [days]);

  const result = getUsageTimeDescription(parsedDays, forceType, isShort);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 90 }}>
      <TextInput label='天数' value={days} keyboardType='numeric' onChangeText={setDays} style={{ marginBottom: 16 }} />

      <Text variant='titleMedium' style={{ marginBottom: 8 }}>
        格式类型
      </Text>
      <RadioButton.Group
        onValueChange={(value) => setForceType(value === "auto" ? undefined : (value as UsageTimeType))}
        value={forceType ?? "auto"}
      >
        {["auto", "year", "month", "week", "day", "hour"].map((type) => {
          const selected = (forceType ?? "auto") === type;
          return (
            <View
              key={type}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <RadioButton value={type} />
              <Text
                style={{
                  color: selected ? theme.colors.primary : theme.colors.onBackground,
                }}
              >
                {type === "auto" ? "自动判断" : type}
              </Text>
            </View>
          );
        })}
      </RadioButton.Group>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 16,
          justifyContent: "space-between",
        }}
      >
        <Text>简写格式</Text>
        <Switch value={isShort} onValueChange={setIsShort} />
      </View>

      <Card
        style={{
          backgroundColor: theme.colors.surfaceVariant,
        }}
      >
        <Card.Title title='格式化结果' />
        <Card.Content>
          <Text variant='titleLarge'>{result.text}</Text>
          <Text variant='bodyMedium' style={{ marginTop: 4 }}>
            类型: {result.type}
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
