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
import { eq } from "drizzle-orm";
import { db } from "@/db/client";

const QUERY_KEY = "stats";

export default function Home() {
  const getStats = async (): Promise<string> => {
    try {
      const dbResult = await db
        .select({ amount: entry.amount, id: entry.id })
        .from(entry)
        .where(eq(entry.isExpense, true));

      console.log("dbResult: ", dbResult);
      return "test";
    } catch (error) {
      console.error("getKeysFromDb: ", error);
      return "test";
    }
  };
  const { data } = useCustomQuery({
    queryKey: [QUERY_KEY],
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
