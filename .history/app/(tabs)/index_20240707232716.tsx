import { View } from "react-native";
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
import { FinancialSummary } from "@/types";
import { H3, P } from "@/components/ui/typography";

const QUERY_KEY = "stats";

export default function Home() {
  const getStats = async (): Promise<FinancialSummary | null> => {
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

      const financialSummary = {
        total: {
          title: "Total",
          description: "Description Total",
          sum: 0,
        },
        income: {
          title: "Income",
          description: "Description Income",
          sum: 0,
        },
        expense: {
          title: "Expense",
          description: "Description Expense",
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

        console.log("financialSummary: ", financialSummary);
        return financialSummary;
      }
      return financialSummary;
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
    <View className="flex-row flex-wrap justify-around">
      {data && (
        <View className="basis-[95%]">
          <Card className="border bg-secondary">
            <CardContent>
              <H3 className="color-background">Ti</H3>
            </CardContent>
          </Card>
        </View>
      )}
    </View>
  );
}
