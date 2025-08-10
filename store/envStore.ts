// store/envStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Environment = "development" | "staging" | "production";

interface EnvState {
  environment: Environment;
  apiEndpoint: string;
  featureFlags: {
    experimentalFeature: boolean;
    analyticsEnabled: boolean;
    debugMode: boolean;
    shakeToDebug: boolean;
  };

  // 方法
  setEnvironment: (env: Environment) => void;
  setApiEndpoint: (endpoint: string) => void;
  toggleFeatureFlag: (flag: keyof EnvState["featureFlags"]) => void;
  reset: () => void;

  // 新增获取环境详细信息
  getEnvDetails: () => {
    isProduction: boolean;
    isStaging: boolean;
    isDev: boolean;
    baseApi: string;
    features: string[];
  };
}

const ENV_CONFIG = {
  development: {
    apiEndpoint: "https://dev.api.example.com",
  },
  staging: {
    apiEndpoint: "https://staging.api.example.com",
  },
  production: {
    apiEndpoint: "https://api.example.com",
  },
};

// 默认使用生产环境配置
const INITIAL_STATE = {
  environment: "production" as const,
  apiEndpoint: ENV_CONFIG.production.apiEndpoint,
  featureFlags: {
    experimentalFeature: false,
    analyticsEnabled: true,
    debugMode: __DEV__, // 开发模式下开启
    shakeToDebug: false,
  },
};

export const useEnvStore = create<EnvState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setEnvironment: (env) =>
        set({
          environment: env,
          apiEndpoint: ENV_CONFIG[env].apiEndpoint,
        }),

      setApiEndpoint: (endpoint) => set({ apiEndpoint: endpoint }),

      toggleFeatureFlag: (flag) =>
        set((state) => ({
          featureFlags: {
            ...state.featureFlags,
            [flag]: !state.featureFlags[flag],
          },
        })),

      reset: () => set(INITIAL_STATE),

      // 新增环境详细信息获取
      getEnvDetails: () => {
        const state = get();
        return {
          isProduction: state.environment === "production",
          isStaging: state.environment === "staging",
          isDev: state.environment === "development",
          baseApi: state.apiEndpoint,
          features: Object.entries(state.featureFlags)
            .filter(([_, enabled]) => enabled)
            .map(([name]) => name),
        };
      },
    }),
    {
      name: "env-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        environment: state.environment,
        featureFlags: state.featureFlags,
      }),
    }
  )
);
