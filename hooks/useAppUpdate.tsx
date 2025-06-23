import * as Updates from "expo-updates";
import { useEffect } from "react";
import { Alert } from "react-native";

const useAppUpdate = (showAlert: boolean = true) => {
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          if (showAlert) {
            Alert.alert("更新可用", "应用将重新加载以应用更新", [
              {
                text: "好的",
                onPress: () => Updates.reloadAsync(),
              },
            ]);
          } else {
            // 如果不显示弹窗，直接重新加载
            Updates.reloadAsync();
          }
        } else {
          console.log("没有可用的更新");
        }
      } catch (e) {
        console.log("检查更新失败", e);
      }
    };

    checkUpdate();
  }, [showAlert]); // 将 showAlert 添加到依赖数组中
};

export default useAppUpdate;
