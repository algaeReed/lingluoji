import { useSettingsStore } from "@/store/settingsStore";
import { View } from "react-native";
import { Button } from "react-native-paper";

const LayoutSwitcher = () => {
  const { layoutMode, setLayoutMode } = useSettingsStore();

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 8 }}>
      <Button mode={layoutMode === "card" ? "contained" : "text"} onPress={() => setLayoutMode("card")}>
        卡片
      </Button>

      <Button mode={layoutMode === "singleColumn" ? "contained" : "text"} onPress={() => setLayoutMode("singleColumn")}>
        单列
      </Button>

      <Button mode={layoutMode === "doubleColumn" ? "contained" : "text"} onPress={() => setLayoutMode("doubleColumn")}>
        双列
      </Button>
    </View>
  );
};

export default LayoutSwitcher;
