import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

function EmptyPage() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons
        name='checkmark-circle'
        size={80}
        color='#8bc34a' // 亮绿色，稍柔和点
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>暂无数据{"\n"}点击右下角按钮添加新物品</Text>
    </View>
  );
}
export default EmptyPage;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#f9f9f9",
  },
  emptyIcon: {
    marginBottom: 24,
    // Android/iOS 可选阴影，视觉更立体
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3, // Android 阴影
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
    lineHeight: 26,
  },
});
