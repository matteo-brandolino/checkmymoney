import { ActivityIndicator, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import DefaultButton from "../../DefaultButton";
import { SheetIcon } from "@/components/Icons";
import { ExcelData } from "@/types";
import { useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";

type UploadFileButtonProps = {
  setExcelData: (data: ExcelData | null) => void;
};

export default function UploadFileButton({
  setExcelData,
}: UploadFileButtonProps) {
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();

  const pickDocument = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/x-vnd.oasis.opendocument.spreadsheet",
          "application/vnd.ms-excel",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;

        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const binaryData = atob(fileContent);

        const workbook = XLSX.read(binaryData, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonSheet = XLSX.utils.sheet_to_json(sheet);
        //todo intersect template (ai or without) and excel json
        setExcelData(jsonSheet as ExcelData);
      }
    } catch (error) {
      console.error("Error picking document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <DefaultButton
          className="px-12"
          title="Pick an Excel file"
          onPress={pickDocument}
          icon={<SheetIcon className="text-background" size={24} />}
        />
      )}
    </View>
  );
}
