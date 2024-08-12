import { P } from "@/components/ui/typography";
import { DataList } from "@/types";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";

export default function SingleTransaction({ item }: { item: DataList }) {
  const { month, isExpense, amount, data, category } = item;
  console.log(JSON.stringify(data));

  const dataList =
    item && data ? data.map((d) => ({ key: d.key, value: d.value })) : [];

  return (
    <View className="px-2">
      <View className="bg-background my-5">
        <Accordion
          type="multiple"
          collapsible
          defaultValue={["item-1"]}
          className="w-full max-w-sm native:max-w-md"
        >
          {dataList && dataList.length > 0 && (
            <AccordionItem value="item-2">
              <View className="flex-row justify-between">
                <P className="mb-4 font-medium text-lg uppercase">{category}</P>
                {isExpense ? (
                  <ArrowDownIcon color={"red"} size={20} />
                ) : (
                  <ArrowUpIcon color={"green"} size={20} />
                )}
              </View>
              <AccordionTrigger>
                <P>Additional</P>
              </AccordionTrigger>
              <AccordionContent>
                {dataList &&
                  dataList.map((dl, index) => (
                    <View key={index}>
                      <View className="mb-4">
                        <P>{dl.key}</P>
                        <View className="whitespace-nowrap">
                          <P className="text-ellipsis">{dl.value}</P>
                        </View>
                      </View>
                    </View>
                  ))}
                {month && <P className="text-ellipsis">Month: {month}</P>}
              </AccordionContent>
              <View className="flex-row justify-end">
                <P className={isExpense ? "color-red-600" : "color-green-500"}>
                  {amount} €
                </P>
              </View>
            </AccordionItem>
          )}
        </Accordion>
      </View>
    </View>
  );
}
