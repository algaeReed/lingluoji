// store/shakeDialogStore.ts
import { create } from "zustand";

interface State {
  visible: boolean;
  setVisible: (v: boolean) => void;
  reset: () => void; // 新增 reset 方法声明
}

export const useShakeDialogStore = create<State>((set) => ({
  visible: false,
  setVisible: (v) => set({ visible: v }),
  reset: () => set({ visible: false }), // reset 恢复默认状态
}));
