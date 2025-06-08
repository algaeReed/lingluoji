import { Alert, StyleSheet } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { STORAGE_KEY } from "./index";

export default function TabTwoScreen() {
  const clearAllData = () => {
    Alert.alert("确认清除", "确定要清空所有数据吗？此操作不可恢复。", [
      { text: "取消", style: "cancel" },
      {
        text: "确定",
        onPress: async () => {
          //TODO
          // setItems([]);
          await AsyncStorage.removeItem(STORAGE_KEY);
        },
      },
    ]);
  };

  return (
    <>
      <Button mode='outlined' onPress={clearAllData} style={{ marginVertical: 12 }}>
        清除所有数据
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
