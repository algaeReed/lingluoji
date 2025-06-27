import { resetAllStores, resetStore } from "@/store";
import { STORAGE_KEYS } from "@/store/storageKeys";
import { useTheme } from "@/theme/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, List, Text } from "react-native-paper";

type CacheItem = {
  name: string;
  size: string;
  type: "file" | "storage";
  path?: string;
};

const CacheSettingsPage = () => {
  const { theme } = useTheme();
  const [cacheSize, setCacheSize] = useState<string>("计算中...");
  const [cacheItems, setCacheItems] = useState<CacheItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  // 获取缓存数据
  const fetchCacheData = async () => {
    setIsLoading(true);
    try {
      const items: CacheItem[] = [];
      let totalSize = 0;

      // 1. 获取文件缓存
      const cacheDir = FileSystem.cacheDirectory;
      if (cacheDir) {
        const files = await FileSystem.readDirectoryAsync(cacheDir);
        for (const file of files) {
          const info = await FileSystem.getInfoAsync(`${cacheDir}${file}`);
          if (info.exists && info.size) {
            const sizeMB = (info.size / (1024 * 1024)).toFixed(4);
            items.push({
              name: file,
              size: `${sizeMB} MB`,
              type: "file",
              path: `${cacheDir}${file}`,
            });
            totalSize += info.size;
          }
        }
      }

      // 2. 获取AsyncStorage数据
      const keys = await AsyncStorage.getAllKeys();
      const storageItems = await AsyncStorage.multiGet(keys);
      storageItems.forEach(([key, value]) => {
        const size = key.length + (value ? value.length : 0);
        const sizeKB = (size / 1024).toFixed(2);
        items.push({
          name: key,
          size: `${sizeKB} KB`,
          type: "storage",
        });
        totalSize += size;
      });

      setCacheItems(items.sort((a, b) => parseFloat(b.size) - parseFloat(a.size)));
      setCacheSize(`${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
    } catch (error) {
      console.error("获取缓存数据失败:", error);
      Alert.alert("错误", "获取缓存数据失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 清除单个缓存项
  const clearCacheItem = async (item: CacheItem) => {
    try {
      if (item.type === "file" && item.path) {
        await FileSystem.deleteAsync(item.path, { idempotent: true });
      } else {
        await AsyncStorage.removeItem(item.name);

        // 判断是否为 store 绑定的 key，若是则同时重置该 store
        const keyToStoreMap: Record<string, keyof typeof STORAGE_KEYS> = {
          [STORAGE_KEYS.user]: "user",
          [STORAGE_KEYS.items]: "items",
          [STORAGE_KEYS.settings]: "settings",
          [STORAGE_KEYS.shakeDialog]: "shakeDialog",
        };

        const storeName = keyToStoreMap[item.name];
        if (storeName) {
          await resetStore(storeName);
          console.log(`[Stores] 已重置 ${storeName} store`);
        }
      }

      Alert.alert("成功", `已删除: ${item.name}`);
      fetchCacheData();
    } catch (error) {
      console.error(`删除 ${item.name} 失败:`, error);
      Alert.alert("错误", `删除 ${item.name} 失败`);
    }
  };

  // 清除所有缓存
  const clearAllCache = async () => {
    setIsClearing(true);

    try {
      // 1. 清除所有 Zustand store 和 AsyncStorage
      await resetAllStores(); // 包括 AsyncStorage 和所有相关 Zustand store 的 reset

      // 2. 删除文件缓存
      const cacheDir = FileSystem.cacheDirectory;
      if (cacheDir) {
        const files = await FileSystem.readDirectoryAsync(cacheDir);
        await Promise.all(
          files.map(async (file) => {
            try {
              await FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true });
            } catch (error) {
              console.error(`删除文件 ${file} 失败:`, error);
            }
          })
        );
      }

      Alert.alert("成功", "缓存已清除");
      fetchCacheData();
    } catch (error) {
      console.error("清除缓存失败:", error);
      Alert.alert("错误", "清除缓存失败");
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    fetchCacheData();
  }, []);

  return (
    <>
      <ScrollView>
        <Stack.Screen options={{ headerShown: false }} />

        <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
          <Appbar.BackAction onPress={() => router.back()} color='white' />
          <Appbar.Content title='缓存设置' color='white' />
        </Appbar.Header>

        <View style={{ padding: 16 }}>
          <List.Section>
            <List.Item title='总缓存大小' description={cacheSize} left={() => <List.Icon icon='chart-box' />} />
          </List.Section>

          {isLoading ? (
            <ActivityIndicator style={styles.loader} animating={true} />
          ) : (
            <>
              <List.Section>
                <List.Subheader>缓存数据明细</List.Subheader>
                {cacheItems.length > 0 ? (
                  cacheItems
                    // todo 暂时隐藏这个默认值，这是恢复，不是删除
                    .filter((item) => item.name !== "@user_storage" && item.name !== "@settings_storage")
                    .map((item, index) => (
                      <List.Item
                        key={`${item.type}-${index}`}
                        title={item.name}
                        description={`${item.size} (${item.type === "file" ? "文件" : "存储"})`}
                        left={() => <List.Icon icon={item.type === "file" ? "file" : "database"} />}
                        right={() => (
                          <Button mode='text' onPress={() => clearCacheItem(item)} textColor='#ff4444'>
                            <Text>删除</Text>
                          </Button>
                        )}
                      />
                    ))
                ) : (
                  <Text style={styles.emptyText}>暂无缓存数据</Text>
                )}
              </List.Section>

              <Button
                mode='contained'
                onPress={clearAllCache}
                loading={isClearing}
                disabled={isClearing}
                style={styles.clearButton}
                labelStyle={styles.clearButtonLabel}
              >
                清除所有缓存
              </Button>

              <Text style={styles.note}>注意：清除缓存会删除临时文件，但不会影响您的账户数据</Text>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: "#ff4444",
  },
  clearButtonLabel: {
    color: "white",
  },
  note: {
    marginTop: 20,
    marginBottom: 30,
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#999",
  },
});

export default CacheSettingsPage;
