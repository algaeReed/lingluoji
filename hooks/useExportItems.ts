// hooks/useExportItems.ts
import { Item, useItemsStore } from "@/store/itemStore";
import dayjs from "dayjs";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import * as XLSX from "xlsx";

import { convertImageUriToBase64 } from "@/utils/convertImageUriToBase64";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

/**
 * 
 * @param items 删除 dailyPrices
使用对象解构 { dailyPrices, ...rest } 直接排除该字段。
转换 imageUri 为 Base64
使用 expo-file-system 的 readAsStringAsync 读取文件并编码为 Base64。
如果是 PNG 图片，记得修改 MIME 类型为 image/png。
如果转换失败，保留原始 imageUri 作为 fallback。
 * @returns 
 */
const processItems = async (items: Item[] | { [x: string]: any; dailyPrices: any; imageUri: any }[]) => {
  return await Promise.all(
    items.map(async ({ dailyPrices, imageUri, ...rest }) => ({
      ...rest,
      imageUri: imageUri ? await convertImageUriToBase64(imageUri) : null,
    }))
  );
};

export function useExportItems() {
  const items = useItemsStore((state) => state.items);
  const setItems = useItemsStore((state) => state.setItems); // 你需要提供这个函数

  // 导出为 JSON
  const exportToJSON = async () => {
    try {
      const exportJsonData = await processItems(items);

      const json = JSON.stringify(exportJsonData, null, 2);
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

      const enriched = parsed.map((item: Item) => ({
        ...item,
        dailyPrices: generateDailyPrices(item.price, item.purchaseDate),
      }));

      setItems(enriched);
      Alert.alert("导入成功", `共导入 ${enriched.length} 条记录`);
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

      const enriched = jsonData.map((item: Item) => ({
        ...item,
        dailyPrices: generateDailyPrices(item.price, item.purchaseDate),
      }));

      setItems(enriched);
      Alert.alert("导入成功", `共导入 ${enriched.length} 条记录`);
    } catch (e) {
      Alert.alert("导入失败", "Excel导入失败：" + (e as Error).message);
    }
  };

  const exportTemplateJSON = () => {
    const template = [
      {
        id: "示例ID",
        name: "示例名称",
        price: 0,
        date: "2025-01-01",
        // 你的数据结构示例
      },
    ];
    const jsonString = JSON.stringify(template, null, 2);
    // 触发文件下载，具体实现可参考你现有导出JSON
    downloadFile(jsonString, "template.json", "application/json");
  };

  const exportTemplateExcel = () => {
    // 用xlsx库构造空模板表格
    import("xlsx").then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet([{ id: "示例ID", name: "示例名称", price: 0, date: "2025-01-01" }]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      // 触发下载，细节按你现有的exportToExcel类似实现
      downloadFile(wbout, "template.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    });
  };

  return {
    exportTemplateJSON,
    exportTemplateExcel,
    exportToJSON,
    exportToExcel,
    importFromJSON,
    importFromExcel,
  };
}

/**
 * @param content  文件内容，字符串或二进制字符串
 * @param filename 文件名，比如 "template.json" / "template.xlsx"
 * @param mimeType MIME 类型，比如 "application/json" / Excel MIME
 */
export async function downloadFile(content: string, filename: string, mimeType: string) {
  try {
    // 先写入临时文件
    const fileUri = FileSystem.cacheDirectory + filename;

    // 对于二进制数据，需要转成 base64 才能写入
    // 这里简单判断 mimeType，json可以直接写，excel二进制需转base64（如果传的是二进制字符串）
    if (mimeType === "application/json") {
      await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });
    } else {
      // Excel一般写二进制字符串，转换成base64后写
      // 这里假设content是二进制字符串，转成base64
      const base64Data = btoa(content);
      await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
    }

    // 打开分享弹窗，用户可选择保存或分享文件
    if (!(await Sharing.isAvailableAsync())) {
      alert("分享功能不可用，无法导出文件。");
      return;
    }
    await Sharing.shareAsync(fileUri, {
      mimeType,
      dialogTitle: `保存文件：${filename}`,
      UTI: mimeType,
    });
  } catch (error) {
    alert("导出失败：" + (error as Error).message);
  }
}

const generateDailyPrices = (price: number, purchaseDate: string): { date: string; price: number }[] => {
  const start = dayjs(purchaseDate);
  const today = dayjs();
  const days = today.diff(start, "day") + 1;
  if (days <= 0) return [];

  const dailyPrice = price / days;
  const result: { date: string; price: number }[] = [];

  for (let i = 0; i < days; i++) {
    const date = start.add(i, "day").format("YYYY-MM-DD");
    result.push({ date, price: parseFloat(dailyPrice.toFixed(2)) });
  }

  return result;
};
