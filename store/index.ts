// store/index.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useItemsStore } from "./itemStore";
import { useSettingsStore } from "./settingsStore";
import { useShakeDialogStore } from "./shakeDialogStore";
import { useUserStore } from "./userStore";
import { STORAGE_KEYS } from "./storageKeys";

/**
 * 重置所有 Store 状态
 */
const resetAllStores = async () => {
  await Promise.all([
    useUserStore.getState().reset(),
    useItemsStore.getState().reset(),
    useSettingsStore.getState().reset(),
    useShakeDialogStore.getState().reset(),

    AsyncStorage.multiRemove(Object.values(STORAGE_KEYS)).catch((e) => console.warn("清除存储失败:", e)),
  ]);
  console.log("[Stores] 所有状态已重置");
};

/**
 * 单个或多个 store 重置
 * @param storeNames 支持传字符串或字符串数组，如 'user' 或 ['user', 'items']
 */
const resetStore = async (storeNames: string | string[]) => {
  const stores = Array.isArray(storeNames) ? storeNames : [storeNames];

  const resetPromises = stores.map((store) => {
    switch (store) {
      case "user":
        return useUserStore.getState().reset();
      case "items":
        return useItemsStore.getState().reset();
      case "settings":
        return useSettingsStore.getState().reset();
      case "shakeDialog":
        return useShakeDialogStore.getState().reset();
      default:
        console.warn(`[Stores] 未知的 store 名称: ${store}`);
        return Promise.resolve();
    }
  });

  const storageKeysToRemove = stores.map((name) => STORAGE_KEYS[name as keyof typeof STORAGE_KEYS]).filter(Boolean);

  resetPromises.push(AsyncStorage.multiRemove(storageKeysToRemove).catch((e) => console.warn("清除存储失败:", e)));

  await Promise.all(resetPromises);
  console.log(`[Stores] 已重置 store: ${stores.join(", ")}`);
};

// 统一导出
export { resetAllStores, resetStore, useItemsStore, useSettingsStore, useShakeDialogStore, useUserStore };
