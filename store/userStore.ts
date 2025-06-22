// @/store/userStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
