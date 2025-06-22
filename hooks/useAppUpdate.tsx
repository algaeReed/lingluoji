import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Alert } from "react-native";

const useAppUpdate = () => {
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert("更新可用", "应用将重新加载以应用更新", [
            {
              text: "好的",
              onPress: () => Updates.reloadAsync(),
            },
          ]);
        } else {
          console.log("没有可用的更新");
        }
      } catch (e) {
        console.log("检查更新失败", e);
      }
    };

    checkUpdate();
  }, []);
};

export default useAppUpdate;
