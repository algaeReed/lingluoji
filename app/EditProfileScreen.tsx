// EditProfileScreen.tsx
import { useUserStore } from "@/store/userStore";
import { useTheme } from "@/theme/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Button, Card, TextInput } from "react-native-paper";

const EditProfileScreen = () => {
  const { theme } = useTheme();
  const { user, updateUser } = useUserStore();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUri, setAvatarUri] = useState(user?.avatarUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("需要权限", "需要相册权限来上传图片");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("错误", "选择图片时出错");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("请输入姓名", "姓名不能为空");
      return;
    }

    try {
      setIsLoading(true);
      await updateUser({
        name: name.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUri,
      });
      router.back();
    } catch (error) {
      console.error("保存失败:", error);
      Alert.alert("错误", "保存更改时出错");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction color='white' onPress={() => router.back()} disabled={isLoading} />
        <Appbar.Content title='编辑资料' titleStyle={{ color: "white" }} />
        <Appbar.Action icon='check' color='white' onPress={handleSave} disabled={isLoading} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled'>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.cardContent}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <Avatar.Image
                size={120}
                source={{ uri: avatarUri || "https://via.placeholder.com/150" }}
                style={styles.avatar}
              />
              <Button
                mode='outlined'
                onPress={handleImagePick}
                style={styles.avatarButton}
                textColor={theme.colors.primary}
              >
                更换头像
              </Button>
            </View>

            {/* Name Input */}
            <TextInput
              label='姓名'
              value={name}
              onChangeText={setName}
              mode='outlined'
              style={styles.input}
              textColor={theme.colors.onSurface}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              maxLength={20}
              disabled={isLoading}
              right={
                name.length > 0 ? (
                  <TextInput.Icon
                    icon='close'
                    onPress={() => setName("")} // 点击清空
                  />
                ) : null
              }
            />

            {/* Bio Input */}
            <TextInput
              label='个人简介'
              value={bio}
              onChangeText={setBio}
              mode='outlined'
              multiline
              numberOfLines={4}
              style={[styles.input, styles.bioInput]}
              textColor={theme.colors.onSurface}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              maxLength={100}
              disabled={isLoading}
              right={
                bio.length > 0 ? (
                  <TextInput.Icon
                    icon='close'
                    onPress={() => setBio("")} // 点击清空
                  />
                ) : null
              }
            />

            {/* Save Button */}
            <Button
              mode='contained'
              onPress={handleSave}
              style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={{ color: theme.colors.onPrimary }}
              loading={isLoading}
              disabled={isLoading}
            >
              保存更改
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    margin: 16,
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 12,
  },
  avatarButton: {
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 24,
    borderRadius: 8,
  },
});

export default EditProfileScreen;
