import { H4, P } from "@/components/ui/typography";
import { DataList } from "@/types";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Text } from "~/components/ui/text";

export default function SingleTransaction({ item }: { item: DataList }) {
  const { month, isExpense, amount, data } = item;
  const dataList =
    item && data
      ? data
          .filter((d) => d.key !== "Amount" && d.key !== "Importo") //todo refactor
          .map((d) => ({ key: d.key, value: d.value }))
      : [];

  const dataListFirstPart = dataList.splice(0, 2);
  const dataListSecondPart = dataList.splice(2);

  return (
    <View className="px-2">
      <View className="bg-background my-5">
        <Accordion
          type="multiple"
          collapsible
          defaultValue={["item-1"]}
          className="w-full max-w-sm native:max-w-md"
        >
          <AccordionItem value="item-1">
            <View className="flex-row justify-between">
              <P className="mb-4 font-medium text-lg">{month}</P>
              {isExpense ? (
                <ArrowDownIcon color={"red"} size={20} />
              ) : (
                <ArrowUpIcon color={"green"} size={20} />
              )}
            </View>
            <AccordionContent>
              {dataListFirstPart &&
                dataListFirstPart.map((firstDl, index) => (
                  <View>
                    <View key={index} className="mb-4">
                      <P className="font-medium italic uppercase">
                        {firstDl.key}
                      </P>
                      <View className="whitespace-nowrap">
                        <P className="text-ellipsis">{firstDl.value}</P>
                      </View>
                    </View>
                  </View>
                ))}
              <View className="flex-row justify-end">
                <P className={isExpense ? "color-red-600" : "color-green-500"}>
                  {amount} €
                </P>
              </View>
            </AccordionContent>
          </AccordionItem>
          {dataListSecondPart && dataListSecondPart.length > 0 && (
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <Text>Additional</Text>
              </AccordionTrigger>
              <AccordionContent>
                {dataListSecondPart &&
                  dataListSecondPart.map((secondDl, index) => (
                    <View>
                      <View key={index} className="mb-4">
                        <P className="font-medium italic uppercase">
                          {secondDl.key}
                        </P>
                        <View className="whitespace-nowrap">
                          <P className="text-ellipsis">{secondDl.value}</P>
                        </View>
                      </View>
                    </View>
                  ))}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </View>
    </View>
  );
}
