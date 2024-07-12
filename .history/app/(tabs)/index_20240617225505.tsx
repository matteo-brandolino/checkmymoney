import { Button } from "@/components/ui/button";
import { CirclePlus } from "@/components/Icons";
import { db } from "@/db/client";
import { template } from "@/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import CommonCard from "@/components/colettyUI/CommonCard";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { Data } from "@/types";
import { isEntry } from "./two";
import DefaultInput from "@/components/colettyUI/DefaultInput";
import { View } from "react-native";

const QUERY_KEY = "keys-template";

export default function TabOneScreen() {
  const queryClient = useQueryClient();

  const initialKeys: Data[] = [
    {
      id: new Date().getTime(),
      value: "",
    },
  ];

  const getKeysFromDb = async (): Promise<Data[]> => {
    try {
      const dbResult = await db
        .select({ data: template.data, id: template.id })
        .from(template)
        .where(eq(template.status, true));

      console.log("dbResult: ", dbResult);
      if (!dbResult || !dbResult[0] || !dbResult[0].data) {
        return initialKeys;
      }
      const splittedDbResult = dbResult[0].data?.split(",");
      if (!splittedDbResult) return initialKeys;
      console.log(
        "splittedDbResult: ",
        splittedDbResult.map((r, i) => ({
          id: new Date().getTime() * (i + 1),
          value: r,
        }))
      );

      return splittedDbResult.map((r, i) => ({
        id: new Date().getTime() * (i + 1),
        value: r,
      }));
    } catch (error) {
      console.error("getKeysFromDb: ", error);
      return initialKeys;
    }
  };

  const { data } = useCustomQuery({
    queryKey: [QUERY_KEY],
    queryFn: getKeysFromDb,
    initialKeys,
  });

  if (isEntry(data) || !data) return null;

  const onAddNewKey = async () => {
    const newKey = [...data, { id: new Date().getTime(), value: "" }];
    queryClient.setQueryData([QUERY_KEY], newKey);
  };

  const onChangeKeys = async (value: string, id: number) => {
    console.log("Try to change key with: ", value, id, data);

    const newKeys = data.map((k) => (k.id === id ? { id, value } : k));

    console.log("onChangeKeyes: ", newKeys);

    queryClient.setQueryData([QUERY_KEY], newKeys);
  };

  const saveKeys = async () => {
    const dataToSave = data.map((d) => d.value).join(",");
    console.log("Saving: ", dataToSave);
    if (dataToSave) {
      try {
        await db.transaction(async (tx) => {
          await tx
            .update(template)
            .set({ status: false })
            .where(eq(template.status, true));
          await tx.insert(template).values({ data: dataToSave, status: true });
        });
      } catch (error) {
        console.log("saveKeys: ", error);
      } finally {
        console.log("Saved");
      }
    }
  };

  return (
    <CommonCard
      description="Description Template"
      queryKey={QUERY_KEY}
      initialKeys={initialKeys}
      getKeysFromDb={getKeysFromDb}
      saveKeys={saveKeys}
    >
      {data &&
        data.map((k) => (
          <View className="my-2" key={k.id}>
            <DefaultInput
              placeholder="Write some stuff..."
              value={k.value}
              onChangeText={(value) => onChangeKeys(value, k.id)}
              aria-labelledbyledBy="inputLabel"
              aria-errormessage="inputError"
            />
          </View>
        ))}
      <Button size="icon" variant="ghost" onPress={onAddNewKey}>
        <CirclePlus color={"grey"} size={32} />
      </Button>
    </CommonCard>
  );
}
