import UploadFileButton from "@/components/colettyUI/tabs/settings/UploadFilePicker";
import { ExcelData } from "@/types";
import { View } from "react-native";
type UploadFileButtonProps = {
  setExcelData: (data: ExcelData | null) => void;
};
export default function FileHandler({ setExcelData }: UploadFileButtonProps) {
  return (
    <View className="flex-1">
      <UploadFileButton setExcelData={setExcelData} />
    </View>
  );
}
