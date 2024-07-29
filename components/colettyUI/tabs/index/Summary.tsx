import { Card, CardContent } from "@/components/ui/card";
import { H3, P } from "@/components/ui/typography";
import { FinancialSummary } from "@/types";
import React from "react";
import { View } from "react-native";

export default function Summary({
  summary,
}: {
  summary: FinancialSummary | null | undefined;
}) {
  return (
    <View className="flex-row flex-wrap justify-around">
      {summary && (
        <View className="basis-[95%]">
          <Card className="border bg-secondary">
            <CardContent className="py-0">
              <View className="flex-row justify-between">
                <View className="border-r-2 border-background justify-center flex-auto my-4">
                  <H3 className="color-background">{summary.total.title}</H3>
                  <P className="color-background">{summary.total.sum} €</P>
                </View>
                <View className="justify-center items-center flex-auto my-6">
                  <View>
                    <H3 className="color-background">{summary.income.title}</H3>
                    <P className="color-background">{summary.income.sum} €</P>
                  </View>
                  <View>
                    <H3 className="color-background">
                      {summary.expense.title}
                    </H3>
                    <P className="color-background">{summary.expense.sum} €</P>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      )}
    </View>
  );
}
