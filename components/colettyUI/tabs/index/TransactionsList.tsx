import { DataList } from "@/types";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import SingleTransaction from "./SingleTransaction";

export default function TransactionsList({
  dataList,
}: {
  dataList: DataList[] | null | undefined;
}) {
  return (
    <View className="h-full mx-auto w-[95%]">
      {dataList && (
        <FlashList
          data={dataList}
          renderItem={({ item }) => <SingleTransaction item={item} />}
          estimatedItemSize={dataList.length}
        />
      )}
    </View>
  );
}
