import Carousel from "@/components/colettyUI/tabs/settings/Carousel";
import { ExcelData } from "@/types";
import { Stack } from "expo-router";
import { useState } from "react";
import UploadMenu from "./UploadMenu";

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
        <UploadMenu setExcelData={setExcelData} />
      )}
    </>
  );
}
