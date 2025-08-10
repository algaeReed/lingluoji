import SectionTitle from "@/components/SectionTitle";
import { useEnvStore } from "@/store/envStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/theme/ThemeProvider";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Banner, Button, Chip, List, Menu, Switch, Text, TextInput } from "react-native-paper";

export default function DebugScreen() {
  const { theme } = useTheme();
  const [envMenuVisible, setEnvMenuVisible] = useState(false);
  const [exploreMenuVisible, setExploreMenuVisible] = useState(false);
  const [endpointEditMode, setEndpointEditMode] = useState(false);
  const [customEndpoint, setCustomEndpoint] = useState("");

  // Tab 控制状态
  const { showExploreTab, setShowExploreTab } = useSettingsStore();

  // 环境控制状态
  const { environment, apiEndpoint, featureFlags, setEnvironment, setApiEndpoint, toggleFeatureFlag, getEnvDetails } =
    useEnvStore();

  const envDetails = getEnvDetails();

  const handleSaveEndpoint = () => {
    setApiEndpoint(customEndpoint);
    setEndpointEditMode(false);
    Alert.alert("API端点已更新", `新的端点: ${customEndpoint}`);
  };

  const getExploreStatus = () => {
    switch (showExploreTab) {
      case true:
        return "显示在底部导航栏";
      case false:
        return "隐藏但可访问";
      case null:
        return "完全隐藏";
      default:
        return "未设置";
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 顶部导航栏 */}
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction color='white' onPress={() => router.back()} />
        <Appbar.Content title='调试面板' titleStyle={{ color: "white" }} />
      </Appbar.Header>

      <View style={styles.content}>
        {/* 环境状态横幅 */}
        <Banner visible style={styles.banner}>
          <View style={styles.envInfo}>
            <Chip icon={envDetails.isProduction ? "shield-check" : "alert"} mode='outlined' style={styles.envChip}>
              {environment.toUpperCase()}
            </Chip>
            <Text variant='bodyMedium' style={styles.apiText}>
              API: {apiEndpoint}
            </Text>
          </View>
        </Banner>

        {/* 1. 界面设置部分 */}
        <List.Section>
          <SectionTitle title='界面设置' />

          <List.Item
            title='Explore页面'
            description={getExploreStatus()}
            left={() => <List.Icon icon='compass-outline' />}
            right={() => (
              <Menu
                visible={exploreMenuVisible}
                onDismiss={() => setExploreMenuVisible(false)}
                anchor={
                  <Pressable onPress={() => setExploreMenuVisible(true)}>
                    <List.Icon icon='menu-down' />
                  </Pressable>
                }
              >
                <Menu.Item
                  title='显示在导航栏'
                  onPress={() => {
                    setShowExploreTab(true);
                    setExploreMenuVisible(false);
                    router.replace("/");
                  }}
                />
                <Menu.Item
                  title='隐藏但可访问'
                  onPress={() => {
                    setShowExploreTab(false);
                    setExploreMenuVisible(false);
                    router.replace("/");
                  }}
                />
                <Menu.Item
                  title='完全隐藏'
                  onPress={() => {
                    setShowExploreTab(false);
                    setExploreMenuVisible(false);
                    router.replace("/");
                  }}
                />
              </Menu>
            )}
          />
        </List.Section>

        {/* 2. 环境配置部分 */}
        <List.Section>
          <SectionTitle title='环境配置' />

          <List.Item
            title='切换环境'
            description={`当前: ${environment}`}
            left={() => <List.Icon icon='server' />}
            right={() => (
              <Menu
                visible={envMenuVisible}
                onDismiss={() => setEnvMenuVisible(false)}
                anchor={
                  <Pressable onPress={() => setEnvMenuVisible(true)}>
                    <List.Icon icon='menu-down' />
                  </Pressable>
                }
              >
                <Menu.Item
                  title='开发环境'
                  onPress={() => {
                    setEnvironment("development");
                    setEnvMenuVisible(false);
                  }}
                />
                <Menu.Item
                  title='预发布环境'
                  onPress={() => {
                    setEnvironment("staging");
                    setEnvMenuVisible(false);
                  }}
                />
                <Menu.Item
                  title='生产环境'
                  onPress={() => {
                    setEnvironment("production");
                    setEnvMenuVisible(false);
                  }}
                />
              </Menu>
            )}
          />

          <List.Item
            title='API端点'
            description={apiEndpoint}
            left={() => <List.Icon icon='link' />}
            right={() => (
              <Button
                mode='outlined'
                onPress={() => {
                  setCustomEndpoint(apiEndpoint);
                  setEndpointEditMode(true);
                }}
                style={styles.editButton}
              >
                编辑
              </Button>
            )}
          />

          {endpointEditMode && (
            <View style={styles.endpointEditor}>
              <TextInput
                label='自定义API端点'
                value={customEndpoint}
                onChangeText={setCustomEndpoint}
                mode='outlined'
                style={styles.input}
              />
              <View style={styles.buttonGroup}>
                <Button mode='contained' onPress={handleSaveEndpoint} style={styles.button}>
                  保存
                </Button>
                <Button mode='outlined' onPress={() => setEndpointEditMode(false)} style={styles.button}>
                  取消
                </Button>
              </View>
            </View>
          )}
        </List.Section>

        {/* 3. 功能开关部分 */}
        <List.Section>
          <SectionTitle title='功能开关' />

          {Object.entries(featureFlags).map(([key, value]) => (
            <List.Item
              key={key}
              title={getFeatureName(key)}
              description={getFeatureDescription(key)}
              left={() => <List.Icon icon={getFeatureIcon(key)} />}
              right={() => <Switch value={value} onValueChange={() => toggleFeatureFlag(key as any)} />}
            />
          ))}
        </List.Section>

        {/* 4. 环境详情卡片 */}
        <List.Section>
          <SectionTitle title='环境详情' />
          <View style={styles.detailCard}>
            <Text variant='titleSmall' style={styles.detailTitle}>
              当前环境状态
            </Text>

            <View style={styles.detailRow}>
              <Text variant='bodyMedium'>环境类型:</Text>
              <Chip icon={envDetails.isProduction ? "shield" : "test-tube"} compact mode='outlined'>
                {environment}
              </Chip>
            </View>

            <View style={styles.detailRow}>
              <Text variant='bodyMedium'>API地址:</Text>
              <Text variant='bodyMedium' selectable style={styles.selectableText}>
                {apiEndpoint}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant='bodyMedium'>启用的功能:</Text>
              <View style={styles.chipContainer}>
                {envDetails.features.length > 0 ? (
                  envDetails.features.map((feature) => (
                    <Chip key={feature} style={styles.featureChip}>
                      {getFeatureName(feature)}
                    </Chip>
                  ))
                ) : (
                  <Text variant='bodyMedium' style={styles.noFeatures}>
                    无额外功能
                  </Text>
                )}
              </View>
            </View>
          </View>
        </List.Section>
      </View>
    </ScrollView>
  );
}

// 辅助函数
function getFeatureName(key: string): string {
  const names: Record<string, string> = {
    experimentalFeature: "实验性功能",
    analyticsEnabled: "数据分析",
    debugMode: "调试模式",
    shakeToDebug: "摇动调试",
  };
  return names[key] || key;
}

function getFeatureDescription(key: string): string {
  const desc: Record<string, string> = {
    experimentalFeature: "启用未完成的新功能",
    analyticsEnabled: "收集使用数据帮助改进产品",
    debugMode: "显示开发工具和日志",
    shakeToDebug: "摇动手机打开调试菜单",
  };
  return desc[key] || "暂无描述";
}

function getFeatureIcon(key: string): string {
  const icons: Record<string, string> = {
    experimentalFeature: "flask",
    analyticsEnabled: "chart-line",
    debugMode: "bug",
    shakeToDebug: "gesture-swipe",
  };
  return icons[key] || "cog";
}

// 样式定义
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  banner: {
    marginBottom: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  envInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  envChip: {
    alignSelf: "flex-start",
  },
  apiText: {
    flexShrink: 1,
  },
  editButton: {
    borderRadius: 4,
  },
  endpointEditor: {
    marginTop: 8,
    gap: 12,
  },
  input: {
    backgroundColor: "transparent",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    flex: 1,
  },
  detailCard: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  detailTitle: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  selectableText: {
    textAlign: "right",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    justifyContent: "flex-end",
  },
  featureChip: {
    margin: 2,
  },
  noFeatures: {
    fontStyle: "italic",
    opacity: 0.6,
  },
});
