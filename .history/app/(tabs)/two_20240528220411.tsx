import { Text, View } from "@/components/Themed";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db/client";
import { entry, template } from "@/db/schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { Fragment } from "react";
import { Check } from "@/components/Icons";

type Entry = {
  id: number;
  key: string;
  value: string;
};
export default function TabTwoScreen() {
  const queryClient = useQueryClient();

  const getKeysFromDb = async (): Promise<Entry[] | null> => {
    try {
      const dbResult = await db
        .select({ data: template.data, id: template.id })
        .from(template)
        .where(eq(template.status, true));

      console.log("dbResult page two: ", dbResult);
      if (!dbResult || !dbResult[0] || !dbResult[0].data) {
        return null;
      }
      const splittedDbResult = dbResult[0].data?.split(",");
      if (!splittedDbResult) return null;
      console.log(
        "splittedDbResult: ",
        splittedDbResult.map((r, i) => ({
          id: new Date().getTime() * (i + 1),
          key: r,
          value: "",
        }))
      );

      return splittedDbResult.map((r, i) => ({
        id: new Date().getTime() * (i + 1),
        key: r,
        value: "",
      }));
    } catch (error) {
      console.error("getKeysFromDb: ", error);
      return null;
    }
  };

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["keys"],
    queryFn: getKeysFromDb,
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    console.log("Error: ", error);

    return <Text>Error: {error.message}</Text>;
  }

  if (!data || data.length === 0) {
    return <Text>Error</Text>;
  }

  const onChangeEntries = (value: string, id: number) => {
    console.log("Try to change key with: ", value, id, data);

    const newKeys = data.map((k) => (k.id === id ? { ...k, value } : k));

    console.log("onChangeKeyes: ", newKeys);

    queryClient.setQueryData(["keys"], newKeys);
  };

  const saveKeys = async () => {
    const dataToSave = data.map((d) => ({ key: d.key, value: d.value }));
    console.log("Saving: ", dataToSave);
    if (dataToSave) {
      try {
        await db.insert(entry).values({ data: dataToSave });
      } catch (error) {
        console.log("saveKeys: ", error);
      } finally {
        console.log("Done");
      }
    }
  };

  return (
    <View className="w-11/12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          {data &&
            data.map((d) => (
              <Fragment key={d.id}>
                <Label nativeID="inputLabel">{d.key}</Label>
                <Input
                  keyboardType="numeric"
                  placeholder="Write some stuff..."
                  value={d.value}
                  onChangeText={(value) => onChangeEntries(value, d.id)}
                  aria-labelledbyledBy="inputLabel"
                  aria-errormessage="inputError"
                />
              </Fragment>
            ))}
        </CardContent>
        <CardFooter>
          <Check color={"grey"} size={32} onPress={saveKeys} />
        </CardFooter>
      </Card>
    </View>
  );
}
