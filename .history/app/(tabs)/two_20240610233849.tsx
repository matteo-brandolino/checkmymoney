import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db/client";
import { entry, template } from "@/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { Fragment } from "react";
import CommonCard from "@/components/colettyUI/CommonCard";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { Data, Entry } from "@/types";

const QUERY_KEY = QUERY_KEY

export const isEntry = (
  arg: Data[] | Entry[] | null | undefined
): arg is Entry[] => {
  if (!arg) return false;
  return arg && arg.filter((element) => "key" in element).length === arg.length;
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

  const { data } = useCustomQuery({
    queryKey: [QUERY_KEY],
    queryFn: getKeysFromDb,
  });

  if (!isEntry(data)) return null;

  const onChangeEntries = (value: string, id: number) => {
    console.log("Try to change key with: ", value, id, data);

    const newKeys =
      data && data.map((k) => (k.id === id ? { ...k, value } : k));

    console.log("onChangeKeyes: ", newKeys);

    queryClient.setQueryData(["keys"], newKeys);
  };

  const saveKeys = async () => {
    const dataToSave =
      data && data.map((d) => ({ key: d.key, value: d.value }));
    console.log("Saving: ", dataToSave);
    if (dataToSave) {
      try {
        await db.insert(entry).values({ data: dataToSave });
        const resetKeys = data.map((k) => ({ ...k, value: "" }));

        queryClient.setQueryData(["keys"], resetKeys);
      } catch (error) {
        console.log("Error saveKeys: ", error);
      } finally {
        console.log("Done");
      }
    }
  };

  return (
    <CommonCard
      title="Create New Template"
      description="Description Template"
      queryKey=QUERY_KEY
      getKeysFromDb={getKeysFromDb}
      saveKeys={saveKeys}
    >
      {data &&
        data.map((d: Entry) => (
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
    </CommonCard>
  );
}
