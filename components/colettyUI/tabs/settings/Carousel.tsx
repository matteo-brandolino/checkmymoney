import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { View, Text, ActivityIndicator } from "react-native";
import PagerView from "react-native-pager-view";
import { DataToSave, ExcelData } from "@/types";
import { FlashList } from "@shopify/flash-list";
import DefaultButton from "../../DefaultButton";
import { XIcon } from "@/components/Icons";
import { saveEntry } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DATA_LIST_QUERY_KEY, SUMMARY_QUERY_KEY } from "@/app/(tabs)";
import { router } from "expo-router";
import { db } from "@/db/client";
import { template } from "@/db/schema";
import { eq } from "drizzle-orm";
import DateInput from "../../DateInput";

type CarouselProps = {
  excelData: ExcelData;
  choice: number | null;
  setExcelData: React.Dispatch<React.SetStateAction<ExcelData | null>>;
};

export default function Carousel({
  excelData,
  choice,
  setExcelData,
}: CarouselProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [templateResult, setTemplateResult] = useState<{
    amountColumnName: string | null;
    categoryColumnName: string | null;
    monthColumnName: string | null;
    categoriesList: string | null;
    data: string | null;
  } | null>(null);
  const queryClient = useQueryClient();

  const updateField = (value: string, index?: number, field?: string) => {
    if (index !== undefined && field != undefined) {
      console.log(
        `UpdateField value: ${value}, data ${JSON.stringify(
          excelData[index]
        )}, field ${field}`
      );

      setExcelData(
        (prevExcelData) =>
          prevExcelData &&
          prevExcelData.map((data, idx) =>
            index === idx ? { ...data, [field]: value } : data
          )
      );
    }
  };
  const removeItem = (index: number) => {
    setExcelData((prevItems) => {
      if (prevItems) {
        const newItems = [...prevItems];
        newItems.splice(index, 1);
        return newItems;
      }
      return prevItems;
    });
  };
  useEffect(() => {
    const getTemplate = async () => {
      const result = await db
        .select({
          amountColumnName: template.amountColumnName,
          categoryColumnName: template.categoryColumnName,
          monthColumnName: template.monthColumnName,
          categoriesList: template.categoriesList,
          data: template.data,
        })
        .from(template)
        .where(eq(template.status, true));
      if (result && result[0]) {
        console.log(`Template ${JSON.stringify(result[0])}`);
        setTemplateResult(result[0]);
      }
    };
    getTemplate();
  }, []);

  const mutation = useMutation({
    mutationFn: saveEntry,
    onSuccess: async (data) => {
      console.log(`New Stats ${JSON.stringify(data)}`);

      await queryClient.invalidateQueries({
        queryKey: [SUMMARY_QUERY_KEY],
      });

      await queryClient.invalidateQueries({
        queryKey: [DATA_LIST_QUERY_KEY],
      });
      if (data && data.idx !== undefined && data.idx >= 0) {
        console.log(`Removing item with idx ${data.idx}`);

        removeItem(data.idx);
      }
    },
  });

  const acceptTransaction = async (dataToSave: DataToSave, idx: number) => {
    if (templateResult !== null) {
      mutation.mutateAsync({
        dataToSave,
        idx,
        useAI: Boolean(choice),
        template: templateResult,
      });
    }
  };

  const acceptAllTransactions = () => {
    console.log(`Accept all transactions`);

    setIsLoading(true);
    excelData.forEach((data, index) =>
      acceptTransaction(
        Object.keys(data).map((k) => ({
          key: k,
          value: data[k].toString(),
        })),
        index
      )
    );
    setIsLoading(false);

    router.push("index");
  };

  return (
    <View className="flex-1">
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <PagerView
            style={{ width: "100%", height: "90%" }} // without this line, ViewPager not showing
            initialPage={0}
          >
            {excelData &&
              excelData.length > 0 &&
              excelData.map((data, index) => (
                <View className="justify-center items-center" key={index}>
                  <Card className="rounded-3x flex-1 my-4 bg-background w-11/12">
                    <CardHeader>
                      <CardTitle>
                        <Text>Transaction</Text>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-[32]">
                      <FlashList
                        data={Object.keys(data)}
                        renderItem={({ item: key }) => (
                          <View key={key}>
                            <Label className="my-2" nativeID="inputLabel">
                              {key}
                            </Label>
                            {key.toLowerCase() ===
                              templateResult?.monthColumnName &&
                            templateResult?.monthColumnName.toLowerCase() ? (
                              <DateInput
                                date={String(data[key])}
                                keyD={key}
                                index={index}
                                setDate={updateField}
                              />
                            ) : (
                              <Input
                                placeholder="Write some stuff..."
                                value={String(data[key])}
                                onChangeText={(value) =>
                                  updateField(value, index, key)
                                }
                                aria-labelledbyledBy="inputLabel"
                                aria-errormessage="inputError"
                              />
                            )}
                          </View>
                        )}
                        estimatedItemSize={excelData.length}
                      />
                    </CardContent>
                    <CardFooter className="flex-row justify-around">
                      <DefaultButton
                        title="Discard"
                        className="rounded-3xl bg-red-500"
                        icon={<XIcon className="text-background" size={24} />}
                        onPress={() => removeItem(index)}
                      />
                      <DefaultButton
                        title="Accept"
                        className="rounded-3xl bg-green-500"
                        onPress={() =>
                          acceptTransaction(
                            Object.keys(data).map((k) => ({
                              key: k.trim(),
                              value: data[k].toString().trim(),
                            })),
                            index
                          )
                        }
                      />
                    </CardFooter>
                  </Card>
                </View>
              ))}
          </PagerView>
          <DefaultButton
            className="w-2/4 mx-auto"
            title="Accept All"
            onPress={acceptAllTransactions}
          />
        </>
      )}
    </View>
  );
}
