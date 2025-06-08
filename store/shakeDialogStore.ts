// store/shakeDialogStore.ts
import { create } from "zustand";

interface State {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

export const useShakeDialogStore = create<State>((set) => ({
  visible: false,
  setVisible: (v) => set({ visible: v }),
}));
