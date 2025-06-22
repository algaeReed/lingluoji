// @/store/userStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "./storageKeys";

export interface User {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  token?: string;
  badges?: string[];
  memberSince?: string;
}

interface UserStore {
  user?: User;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  getUser: () => User | undefined;
  reset: () => Promise<void>; // 新增 reset 方法声明
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: undefined,
      setUser: (user) => set({ user }),
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        } else {
          set({ user: updates as User });
        }
      },
      clearUser: () => set({ user: undefined }),
      getUser: () => get().user,
      reset: async () => {
        try {
          await AsyncStorage.removeItem(STORAGE_KEYS.user);
          set({ user: undefined });
        } catch (error) {
          console.error("重置用户数据失败:", error);
          throw error;
        }
      },
    }),
    {
      name: STORAGE_KEYS.user,
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
