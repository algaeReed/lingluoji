import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { Appbar, List, Switch } from "react-native-paper";

import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/theme/ThemeProvider";

const SettingsScreen = ({}) => {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const showTabBar = useSettingsStore((state) => state.showTabBar);
  const setShowTabBar = useSettingsStore((state) => state.setShowTabBar);
  const toggleTabBar = () => {
    Alert.alert(showTabBar ? "确认隐藏底部栏？" : "确认显示底部栏？", "该操作将立即生效，并返回首页。", [
      { text: "取消", style: "cancel" },
      {
        text: "确认",
        onPress: () => {
          setShowTabBar(!showTabBar);
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <Appbar.Header style={{ backgroundColor: theme.colors.primary, justifyContent: "flex-end" }}>
        <Appbar.BackAction onPress={() => router.back()} color='white' />
        <Appbar.Content title='设置' color='white' />
      </Appbar.Header>

      <ScrollView style={styles.container}>
        {/* 偏好设置 */}
        <List.Section>
          <List.Subheader>偏好设置</List.Subheader>
          <List.Item
            title='时间显示格式'
            description='设备已经使用时间显示格式'
            left={() => <List.Icon icon='clock-outline' />}
            right={() => <List.Icon icon='chevron-right' />}
            onPress={() => {
              router.push("/UsageFormatterPage");
            }}
          />

          <List.Item
            title='显示底部栏'
            description={showTabBar ? "底部栏当前可见" : "底部栏当前隐藏"}
            left={() => <List.Icon icon='view-column-outline' />}
            right={() => <Switch value={showTabBar} onValueChange={toggleTabBar} />}
          />

          <List.Item
            title='通知'
            description='接收应用通知'
            left={() => <List.Icon icon='bell-outline' />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
              />
            )}
          />
        </List.Section>

        {/* 缓存管理 */}
        <List.Section>
          <List.Subheader>缓存管理</List.Subheader>
          <List.Item
            title='缓存设置'
            description='管理应用缓存数据'
            left={() => <List.Icon icon='cached' />}
            right={() => <List.Icon icon='chevron-right' />}
            onPress={() => router.push("/CacheSettingsPage")}
          />
        </List.Section>

        {/* 关于 */}
        <List.Section>
          <List.Subheader>关于</List.Subheader>
          <List.Item
            title='隐私政策'
            description='了解我们如何处理您的数据'
            left={() => <List.Icon icon='shield-lock-outline' />}
            onPress={() => {}}
          />
          <List.Item
            title='帮助与反馈'
            description='获取帮助或提交反馈'
            left={() => <List.Icon icon='help-circle-outline' />}
            onPress={() => {}}
          />
          <List.Item
            title='版本信息'
            description='当前版本 v1.0.0'
            left={() => <List.Icon icon='information-outline' />}
            onPress={() => {}}
          />
        </List.Section>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default SettingsScreen;
