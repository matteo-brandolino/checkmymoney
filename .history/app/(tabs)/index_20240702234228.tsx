import { Text, View } from "react-native";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
      console.log("dbResult2: ", await db.select().from(entry));

      if (dbResult && dbResult.length > 0) {
        let displayData = dbResult.map((r) => {
          const title = r.isExpense ? "Expense" : "Income";
          const description = r.isExpense
            ? "Description Expense"
            : "Description Income";
          const sum = r.sum ? parseInt(r.sum) : 0;
          return {
            key: new Date().getTime(),
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
          key: new Date().getTime(),
          title: "Total",
          description: "Description Total",
          sum: sumTotal,
        };
        displayData = [...displayData, displayTotal];

        console.log("displayData: ", displayData);
        return displayData;
      }
      return [{
        {
          key: new Date().getTime(),
          title: "Income",
          description: "Description Income",
          sum: 0
        },
        {
          key: new Date().getTime(),
          title: "Expense",
          description: "Description Expense",
          sum: 0
        },
        key: new Date().getTime(),
        title: "Total",
        description: "Description Total",
        sum: 0
      }
      ];
    } catch (error) {
      console.error("getKeysFromDb: ", error);
      return null;
    }
  };
  const { data } = useCustomQuery({
    queryKey: [QUERY_KEY],
    queryFn: getStats,
  });
  console.log(data);

  return (
    <View className="flex-row justify-around">
      {data &&
        data.length &&
        data.map((d, i) => (
          <Card key={i} className="basis-36">
            <CardHeader>
              <CardTitle>{d.title}</CardTitle>
              <CardDescription>{d.description} - </CardDescription>
            </CardHeader>
            <CardContent>
              <Text>{d.sum}</Text>
            </CardContent>
          </Card>
        ))}
    </View>
  );
}
