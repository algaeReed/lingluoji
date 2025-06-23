import StatusManager from "@/components/StatusManager/StatusManager";
import { useUserStore } from "@/store/userStore";
import { useTheme } from "@/theme/ThemeProvider";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Button, Card, Paragraph, Title } from "react-native-paper";

const ProfileScreen = () => {
  const { theme } = useTheme();
  const { user } = useUserStore();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary, justifyContent: "flex-end" }}>
        <Appbar.Action
          icon='menu'
          color='white'
          onPress={() => {
            router.push("/EditProfileScreen");
          }}
        />
        <Appbar.Content title='我的' titleStyle={{ color: "white" }} />
        <Appbar.Action
          icon='pencil'
          color='white'
          onPress={() => {
            router.push("/EditProfileScreen");
          }}
        />
      </Appbar.Header>

      {/* User info section */}
      <Card style={styles.userCard}>
        <Card.Content>
          <View style={styles.userInfo}>
            <Avatar.Image
              size={120}
              source={{ uri: user?.avatarUrl || "https://via.placeholder.com/150" }}
              style={styles.avatar}
            />
            <View style={styles.userText}>
              <Title style={styles.userName}>{user?.name || "零落集"}</Title>
              <Paragraph
                style={styles.editText}
                onPress={() => {
                  router.push("/EditProfileScreen");
                }}
              >
                编辑资料
              </Paragraph>
            </View>
          </View>

          <View style={styles.companyInfo}>
            <Paragraph>{user?.bio || "零落成泥碾作尘 只有香如故"}</Paragraph>
            <StatusManager />
          </View>
        </Card.Content>
      </Card>

      {/* Function cards */}
      <Card style={styles.functionCard}>
        <Card.Content>
          <View style={styles.functionRow}>
            <Button
              icon='palette'
              mode='text'
              onPress={() => {
                router.push("/ThemeScreen");
              }}
            >
              外观
            </Button>
          </View>
          <View style={styles.functionRow}>
            <View style={styles.mergeButtonRow}>
              <Button
                icon='upload'
                mode='contained-tonal'
                onPress={() => router.push("/ImportExportScreen?mode=import&pulseCount=1")}
                style={styles.mergeLeft}
                labelStyle={styles.mergeLabel}
                buttonColor={theme.colors.primaryContainer}
              >
                导入
              </Button>
              <Button
                icon='download'
                mode='contained-tonal'
                onPress={() => router.push("/ImportExportScreen?mode=export&pulseCount=1")}
                style={styles.mergeRight}
                labelStyle={styles.mergeLabel}
                buttonColor={theme.colors.primaryContainer}
              >
                导出
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Settings section */}
      <Card style={styles.menuCard}>
        <Card.Content>
          <View style={styles.functionRow}>
            <Button
              icon='cog'
              mode='text'
              onPress={() => {
                router.push("/SettingsScreen");
              }}
            >
              设置与隐私
            </Button>
          </View>

          <View style={styles.functionRow}>
            <Button icon='help-circle' mode='text' onPress={() => {}}>
              客服与帮助
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  mergeButtonRow: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 8,
  },
  mergeLeft: {
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    flex: 1,
    marginRight: 1,
  },
  mergeRight: {
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    flex: 1,
    marginLeft: 1,
  },
  mergeLabel: {
    fontSize: 14,
  },
});

export default ProfileScreen;
