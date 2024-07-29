import Carousel from "@/components/colettyUI/tabs/add/Carousel";
import UploadFileButton from "@/components/colettyUI/tabs/add/UploadFilePicker";
import { ExcelData } from "@/types";
import { Stack } from "expo-router";
import { useState } from "react";

export default function ImportFile() {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
        }}
      />
      {excelData ? (
        <Carousel excelData={excelData} setExcelData={setExcelData} />
      ) : (
        <UploadFileButton setExcelData={setExcelData} />
      )}
    </>
  );
}
