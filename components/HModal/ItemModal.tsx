import dayjs from "dayjs";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Modal, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

import AlertDialog from "../AlertDialog/AlertDialog";
import AutoCompleteInput from "../Input/AutoCompleteInput";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSave: (data: { name: string; price: number; purchaseDate: Date; imageUri?: string }) => void;
  onDelete?: () => void;
  initialData?: {
    name: string;
    price: number;
    purchaseDate: Date;
    imageUri?: string;
  };
  isEditing?: boolean;
};

export default function ItemModal({ visible, onDismiss, onSave, onDelete, initialData, isEditing = false }: Props) {
  const theme = useTheme();

  const [name, setName] = useState(initialData?.name ?? "");
  const [priceText, setPriceText] = useState(initialData ? initialData.price.toString() : "");
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(initialData?.purchaseDate);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | undefined>(initialData?.imageUri);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setDialogVisible(true);
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPriceText(initialData.price.toString());
      setPurchaseDate(initialData.purchaseDate);
      setImageUri(initialData.imageUri);
    } else {
      setName("");
      setPriceText("");
      setPurchaseDate(undefined);
      setImageUri(undefined);
    }
  }, [initialData, visible]);

  const handleSave = () => {
    const price = Number(priceText);
    if (!name.trim()) {
      showDialog("请输入物品名称");
      return;
    }
    if (!priceText.trim() || isNaN(price) || price <= 0) {
      showDialog("请输入有效的价格");
      return;
    }
    if (!purchaseDate) {
      showDialog("请选择购买日期");
      return;
    }

    onSave({ name: name.trim(), price, purchaseDate, imageUri });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
    >
      <AutoCompleteInput label='物品名称' value={name} onChangeText={setName} style={styles.input} />

      <TextInput
        label='价格'
        value={priceText}
        onChangeText={setPriceText}
        keyboardType='numeric'
        mode='outlined'
        style={styles.input}
        right={
          priceText.length > 0 ? (
            <TextInput.Icon
              icon='close'
              onPress={() => setPriceText("")} // 点击清空
            />
          ) : null
        }
      />

      <Button mode='outlined' onPress={() => setDatePickerVisible(true)} style={{ marginBottom: 12 }}>
        {purchaseDate ? `购买日期: ${dayjs(purchaseDate).format("YYYY-MM-DD")}` : "选择购买日期"}
      </Button>

      <DatePickerModal
        locale='zh'
        mode='single'
        visible={datePickerVisible}
        onDismiss={() => setDatePickerVisible(false)}
        date={purchaseDate}
        onConfirm={({ date }) => {
          setDatePickerVisible(false);
          if (date) setPurchaseDate(date);
        }}
        saveLabel='确定'
        label='选择日期'
        animationType='slide'
      />

      <Button mode='outlined' onPress={pickImage} style={{ marginBottom: 12 }}>
        {imageUri ? "更换图片" : "选择图片"}
      </Button>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode='cover' />
        </View>
      )}

      <Button mode='contained' onPress={handleSave} style={{ marginBottom: 8 }}>
        保存
      </Button>

      {isEditing && onDelete && (
        <Button mode='outlined' onPress={onDelete} color={theme.colors.error}>
          删除
        </Button>
      )}

      <AlertDialog visible={dialogVisible} message={dialogMessage} onDismiss={() => setDialogVisible(false)} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 12,
    padding: 20,
    elevation: 8,
  },
  input: {
    marginBottom: 24,
    backgroundColor: "transparent",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
