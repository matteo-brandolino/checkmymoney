import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { View, Text } from "react-native";
import PagerView from "react-native-pager-view";
import { DataToSave, ExcelData } from "@/types";
import { FlashList } from "@shopify/flash-list";
import DefaultButton from "../../DefaultButton";
import { XIcon } from "@/components/Icons";
import { saveEntry } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DATA_LIST_QUERY_KEY, SUMMARY_QUERY_KEY } from "@/app/(tabs)";

type CarouselProps = {
  excelData: ExcelData;
  setExcelData: React.Dispatch<React.SetStateAction<ExcelData | null>>;
};

export default function Carousel({ excelData, setExcelData }: CarouselProps) {
  const queryClient = useQueryClient();

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
      if (data && data.idx) {
        removeItem(data.idx);
      }
    },
  });

  const acceptTransaction = (dataToSave: DataToSave, idx: number) => {
    mutation.mutateAsync({ dataToSave, idx });
  };

  return (
    <View className="flex-1">
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
                    <Text>title</Text>
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
                        <Input
                          placeholder="Write some stuff..."
                          value={String(data[key])}
                          onChangeText={() => console.log("here")}
                          aria-labelledbyledBy="inputLabel"
                          aria-errormessage="inputError"
                        />
                      </View>
                    )}
                    estimatedItemSize={200}
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
                          key: k,
                          value: data[k].toString(),
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
        onPress={() => console.log("todo")}
      />
    </View>
  );
}
