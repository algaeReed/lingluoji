import { useTheme } from "@/theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

function EmptyPage() {
  const { theme } = useTheme(); // 获取当前主题

  return (
    <View style={styles.emptyContainer}>
      <Ionicons name='infinite-outline' size={80} color={theme.colors.elevation.level1} style={styles.emptyIcon} />
      <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
        暂无数据{"\n"}点击右下角按钮添加新物品
      </Text>
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
  },
  emptyIcon: {
    marginBottom: 24,
    // Android/iOS 阴影效果
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 18,
    // color 这里改成动态，默认写淡色了
    textAlign: "center",
    lineHeight: 26,
  },
});
