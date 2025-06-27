import AlertDialog from "@/components/AlertDialog/AlertDialog";
import useAlert from "@/hooks/useAlert";
import { useUserStore } from "@/store/userStore";
import { useTheme } from "@/theme/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Button, Card, TextInput } from "react-native-paper";

const EditProfileScreen = () => {
  const { theme } = useTheme();
  const { user, updateUser } = useUserStore();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUri, setAvatarUri] = useState(user?.avatarUrl || "");
  const [isLoading, setIsLoading] = useState(false);

  const { alertVisible, alertMessage, alertTitle, alertOptions, showAlert, hideAlert } = useAlert();

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showAlert("需要相册权限来上传图片", {
          title: "权限不足",
          type: "warning",
        });
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
        showAlert("头像已更新", { type: "success", duration: 1500 });
      }
    } catch (error) {
      console.error("Image picker error:", error);
      showAlert("选择图片时出错", { type: "error" });
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert("姓名不能为空", {
        title: "输入错误",
        type: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);
      await updateUser({
        name: name.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUri,
      });
      showAlert("资料保存成功", {
        type: "success",
        duration: 1000,
        onConfirm: () => router.back(),
      });
    } catch (error) {
      console.error("保存失败:", error);
      showAlert("保存更改时出错", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const clearField = (field: "name" | "bio") => {
    if (field === "name") setName("");
    if (field === "bio") setBio("");
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
                size={80}
                source={{ uri: avatarUri || "https://via.placeholder.com/150" }}
                style={styles.avatar}
              />
              <Button
                mode='outlined'
                onPress={handleImagePick}
                style={styles.avatarButton}
                textColor={theme.colors.primary}
                disabled={isLoading}
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
                name.length > 0 && (
                  <TextInput.Icon icon='close' onPress={() => clearField("name")} disabled={isLoading} />
                )
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
                bio.length > 0 && <TextInput.Icon icon='close' onPress={() => clearField("bio")} disabled={isLoading} />
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

      <AlertDialog
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertOptions.type}
        confirmText={alertOptions.confirmText}
        onDismiss={hideAlert}
        onConfirm={() => {
          alertOptions.onConfirm?.();
          hideAlert();
        }}
      />
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
    elevation: 2,
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
    backgroundColor: "transparent",
  },
  avatarButton: {
    borderRadius: 8,
    borderWidth: 1,
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
    paddingVertical: 6,
  },
});

export default EditProfileScreen;
