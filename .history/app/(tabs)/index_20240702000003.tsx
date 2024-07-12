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

const QUERY_KEY = "stats";

export default function Home() {
  const getStats = async (): Promise<null> => {
    try {
      const dbResult = await db
        .select({
          amount: entry.amount,
          isExpense: entry.isExpense,
          sum: sum(entry.amount),
        })
        .from(entry)
        .groupBy(entry.isExpense);
      const dbResult2 = await db
        .select({ amount: entry.amount, id: entry.id })
        .from(entry);
      console.log("dbResult: ", dbResult);
      console.log("dbResult2: ", dbResult2);
      return null;
    } catch (error) {
      console.error("getKeysFromDb: ", error);
      return null;
    }
  };
  const { data } = useCustomQuery({
    queryFn: getStats,
  });

  return (
    <View className="flex-row justify-around">
      <Card className="basis-36">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Card Content</Text>
        </CardContent>
        <CardFooter>
          <Text>Card Footer</Text>
        </CardFooter>
      </Card>
      <Card className="basis-36">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Card Content</Text>
        </CardContent>
        <CardFooter>
          <Text>Card Footer</Text>
        </CardFooter>
      </Card>
      <Card className="basis-36">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Card Content</Text>
        </CardContent>
        <CardFooter>
          <Text>Card Footer</Text>
        </CardFooter>
      </Card>
    </View>
  );
}
