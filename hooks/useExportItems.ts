// hooks/useExportItems.ts
import { Item, useItemsStore } from "@/store/itemStore";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import * as XLSX from "xlsx";

export function useExportItems() {
  const items = useItemsStore((state) => state.items);
  const setItems = useItemsStore((state) => state.setItems); // 你需要提供这个函数

  // 导出为 JSON
  const exportToJSON = async () => {
    try {
      const json = JSON.stringify(items, null, 2);
      const fileUri = FileSystem.cacheDirectory + "items.json";
      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
    } catch (e) {
      Alert.alert("导出失败", "JSON导出失败：" + (e as Error).message);
    }
  };

  // 导出为 Excel
  const exportToExcel = async () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(items);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

      const excelBinary = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
      const fileUri = FileSystem.cacheDirectory + "items.xlsx";
      await FileSystem.writeAsStringAsync(fileUri, excelBinary, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(fileUri);
    } catch (e) {
      Alert.alert("导出失败", "Excel导出失败：" + (e as Error).message);
    }
  };

  // 导入 JSON 文件
  const importFromJSON = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const fileUri = result.assets[0].uri;
      const content = await FileSystem.readAsStringAsync(fileUri);
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) throw new Error("文件内容无效，必须是数组");
      setItems(parsed);
      Alert.alert("导入成功", `共导入 ${parsed.length} 条记录`);
    } catch (e) {
      Alert.alert("导入失败", "JSON导入失败：" + (e as Error).message);
    }
  };

  // 导入 Excel 文件
  const importFromExcel = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const fileUri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(base64, { type: "base64" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet) as Item[];
      jsonData && setItems(jsonData);
      Alert.alert("导入成功", `共导入 ${jsonData.length} 条记录`);
    } catch (e) {
      Alert.alert("导入失败", "Excel导入失败：" + (e as Error).message);
    }
  };

  return {
    exportToJSON,
    exportToExcel,
    importFromJSON,
    importFromExcel,
  };
}
