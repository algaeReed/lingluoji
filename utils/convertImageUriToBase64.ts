import * as FileSystem from "expo-file-system";

const convertImageUriToBase64 = async (imageUri: string) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      console.warn("File does not exist:", imageUri);
      return null;
    }

    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 根据文件类型添加正确的前缀（这里假设是JPEG）
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

export { convertImageUriToBase64 };
