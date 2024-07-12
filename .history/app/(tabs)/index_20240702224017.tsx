import { Text, View } from "react-native";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { entry } from "@/db/schema";
import { eq, sum } from "drizzle-orm";
import { db } from "@/db/client";
import { DisplayData } from "@/types";

const QUERY_KEY = "stats";

export default function Home() {
  const getStats = async (): Promise<DisplayData[] | null> => {
    try {
      const dbResult = await db
        .select({
          isExpense: entry.isExpense,
          sum: sum(entry.amount),
        })
        .from(entry)
        .groupBy(entry.isExpense);
      console.log("dbResult: ", dbResult);
      if (dbResult) {
        let displayData = dbResult.map((r) => {
          const title = r.isExpense ? "Income" : "Expense";
          const description = r.isExpense
            ? "Description Income"
            : "Description Expense";
          const sum = r.sum ? parseInt(r.sum) : 0;
          return {
            title,
            description,
            sum,
          };
        });
        const sumTotal = displayData.reduce(
          (accumulator, currentValue) => accumulator + currentValue.sum,
          0
        );
        const displayTotal = {
          title: "Total",
          description: "Description Total",
          sum: sumTotal,
        };
        displayData = [...displayData, displayTotal];

        console.log("displayData: ", displayData);
        return displayData;
      }
      return null;
    } catch (error) {
      console.error("getKeysFromDb: ", error);
      return null;
    }
  };
  const { data } = useCustomQuery({
    queryKey: [QUERY_KEY],
    queryFn: getStats,
  });

  return (
    <View className="flex-row justify-around">
      {data &&
        data.length &&
        data.map((d) => (
          <Card className="basis-36">
            <CardHeader>
              <CardTitle>{d.title}</CardTitle>
              <CardDescription>{d.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>{d.sum}</Text>
            </CardContent>
          </Card>
        ))}
    </View>
  );
}
