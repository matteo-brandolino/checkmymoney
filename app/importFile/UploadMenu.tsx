import DefaultButton from "@/components/colettyUI/DefaultButton";
import { ExcelData } from "@/types";
import { useState } from "react";
import { View } from "react-native";
import FileHandler from "./FileHandler";
import { BrainIcon, PackageIcon } from "@/components/Icons";
import { db } from "@/db/client";
import { count } from "drizzle-orm";
import { template } from "@/db/schema";
import { router } from "expo-router";

type UploadFileButtonProps = {
  setExcelData: (data: ExcelData | null) => void;
  choice: number | null;
  setChoice: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function UploadMenu({
  setExcelData,
  choice,
  setChoice,
}: UploadFileButtonProps) {
  const withTemplateClick = async () => {
    setChoice(0);
    const templateFound = await db.select({ value: count() }).from(template);
    if (
      !templateFound[0] ||
      !templateFound[0].value ||
      templateFound[0].value === 0
    ) {
      router.push("newTemplate");
    }
  };

  return (
    <View className="flex-1">
      {choice === null ? (
        <View className="flex-1 justify-center items-center">
          <DefaultButton
            title="Use template"
            className="rounded-3xl"
            icon={<PackageIcon className="text-background" size={16} />}
            onPress={withTemplateClick}
          />
          <DefaultButton
            title="Create template with AI"
            className="mt-24 rounded-3xl"
            icon={<BrainIcon className="text-background" size={16} />}
            onPress={() => setChoice(1)}
          />
        </View>
      ) : (
        <FileHandler setExcelData={setExcelData} />
      )}
    </View>
  );
}
