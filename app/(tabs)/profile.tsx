import React from "react";
import { Image, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Appbar, Button, Card, Paragraph, Text, Title, useTheme } from "react-native-paper";

const ProfileScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar translucent backgroundColor='transparent' barStyle='light-content' />

      {/* 自定义沉浸式顶部栏 */}
      <View style={styles.header}>
        <Appbar.Action icon='arrow-left' color='white' onPress={() => {}} />
        <Appbar.Action icon='pencil' color='white' onPress={() => {}} />
      </View>

      {/* 用户信息部分 */}
      <Card style={styles.userCard}>
        <Card.Content>
          <View style={styles.userInfo}>
            <Image source={{ uri: "https://example.com/avatar.jpg" }} style={styles.avatar} />
            <View style={styles.userText}>
              <Title style={styles.userName}>张哲</Title>
              <Paragraph style={styles.editText}>编辑资料</Paragraph>
            </View>
          </View>

          <View style={styles.companyInfo}>
            <Paragraph>零落成泥碾作尘 只有香如故</Paragraph>
            <View style={styles.badgeContainer}>
              <Text style={[styles.badge, { backgroundColor: theme.colors.primary }]}>高级认证</Text>
              <Text style={[styles.badge, { backgroundColor: theme.colors.primary }]}>专业版 1年</Text>
              <Text style={[styles.badge, { backgroundColor: theme.colors.primary }]}>970</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* 状态按钮 */}
      <Button
        mode='contained'
        style={styles.statusButton}
        icon='plus'
        onPress={() => {}}
        labelStyle={{ color: "white" }}
      >
        状态...
      </Button>

      {/* 功能卡片 */}
      <Card style={styles.functionCard}>
        <Card.Content>
          <View style={styles.functionRow}>
            <Button icon='upload' mode='text' onPress={() => {}}>
              导入
            </Button>
          </View>
          <View style={styles.functionRow}>
            <Button icon='download' mode='text' onPress={() => {}}>
              导出
            </Button>
          </View>
          <View style={styles.functionRow}>
            <Button icon='palette' mode='text' onPress={() => {}}>
              主题
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* 发现和设置部分 */}
      <Card style={styles.menuCard}>
        <Card.Content>
          <View style={styles.functionRow}>
            <Button icon='help-circle' mode='text' onPress={() => {}}>
              客服与帮助
            </Button>
          </View>

          <View style={styles.functionRow}>
            <Button icon='cog' mode='text' onPress={() => {}}>
              设置与隐私
            </Button>
          </View>
        </Card.Content>
      </Card>
      {/* </LinearGradient> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f5f5f5",
    paddingTop: StatusBar.currentHeight,
    // backgroundColor: "transparent", // 这里让背景色由theme控制
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 32,
  },
  userCard: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: "white",
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  editText: {
    color: "#888",
  },
  companyInfo: {
    marginTop: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    marginTop: 8,
    flexWrap: "wrap",
  },
  badge: {
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
    overflow: "hidden",
  },
  statusButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 6,
  },
  functionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  functionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  menuCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
});

export default ProfileScreen;
