import { View } from "react-native";
import React from "react";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { entry } from "@/db/schema";
import { sum } from "drizzle-orm";
import { db } from "@/db/client";
import { DataList, FinancialSummary } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Summary from "@/components/colettyUI/tabs/index/Summary";
import TransactionsList from "@/components/colettyUI/tabs/index/TransactionsList";

export const SUMMARY_QUERY_KEY = "recap";
export const DATA_LIST_QUERY_KEY = "dataList";

export default function Home() {
  const insets = useSafeAreaInsets();

  const getSummary = async (): Promise<FinancialSummary | null> => {
    try {
      const dbResult = await db
        .select({
          isExpense: entry.isExpense,
          sum: sum(entry.amount),
        })
        .from(entry)
        .groupBy(entry.isExpense);

      console.info("FinancialSummary dbResult: ", dbResult);

      const financialSummary = {
        total: {
          title: "Total",
          sum: 0,
        },
        income: {
          title: "Income",
          sum: 0,
        },
        expense: {
          title: "Expense",
          sum: 0,
        },
      };
      if (dbResult && dbResult.length > 0) {
        dbResult.forEach((db) => {
          const key = db.isExpense ? "expense" : "income";
          const sum = db.sum ? parseInt(db.sum) : 0;
          financialSummary[key]["sum"] = sum;
          financialSummary["total"]["sum"] += sum;
        });

        console.info("financialSummary: ", financialSummary);
        return financialSummary;
      }
      return financialSummary;
    } catch (error) {
      console.error("getSummary: ", error);
      return null;
    }
  };

  const getDataList = async (): Promise<DataList[] | null> => {
    try {
      const dbResult = await db.select().from(entry);

      console.info("Data list dbResult: ", dbResult);

      if (dbResult && dbResult.length > 0) {
        return dbResult;
      }
      return null;
    } catch (error) {
      console.error("getDataList: ", error);
      return null;
    }
  };
  const { data: summary } = useCustomQuery({
    queryKey: [SUMMARY_QUERY_KEY],
    queryFn: getSummary,
  });

  const { data: dataList } = useCustomQuery({
    queryKey: [DATA_LIST_QUERY_KEY],
    queryFn: getDataList,
  });

  return (
    <View style={{ paddingTop: insets.top * 2 }}>
      <Summary summary={summary} />
      <TransactionsList dataList={dataList} />
    </View>
  );
}
