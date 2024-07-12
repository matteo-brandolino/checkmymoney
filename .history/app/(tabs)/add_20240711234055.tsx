import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/db/client";
import { entry, template } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Fragment, useEffect, useState } from "react";
import CommonCard from "@/components/colettyUI/CommonCard";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { Entry, FinancialSummary } from "@/types";
import { P } from "@/components/ui/typography";
import { CirclePlus } from "lucide-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = "keys-entry";

export default function Add() {
  const initialEntries: Entry[] = [
    {
      id: new Date().getTime(),
      key: "Amount",
      value: "",
    },
  ];
  const [localState, setLocalState] = useState(initialEntries);

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

      const result = splittedDbResult.map((r, i) => ({
        id: new Date().getTime() * (i + 1),
        key: r,
        value: "",
      }));
      return [...result, ...initialEntries];
    } catch (error) {
      console.error("getKeysFromDb: ", error);
      return null;
    }
  };

  const { data } = useCustomQuery({
    queryKey: [QUERY_KEY],
    queryFn: getKeysFromDb,
    initialKeys: initialEntries,
  });

  const saveKeys = async () => {
    const dataToSave = localState.map((d) => ({ key: d.key, value: d.value }));
    console.log("Saving: ", dataToSave);
    if (dataToSave) {
      try {
        const amountObj = dataToSave.filter((d) => d.key === "Amount")[0];
        if (!amountObj) throw new Error("Amount Obj doesn't exist");

        const { value } = amountObj;
        //todo check if is number
        const amount = parseInt(value);
        const isExpense = amount < 0;
        await db.insert(entry).values({
          data: dataToSave,
          isExpense,
          amount: amount,
          month: new Date().toLocaleString("default", { month: "long" }),
        });
        const resetKeys = localState.map((k) => ({ ...k, value: "" }));

        setLocalState(resetKeys);
        return { amount, isExpense };
      } catch (error) {
        console.log("Error saveKeys: ", error);
      } finally {
        console.log("Done");
      }
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveKeys,
    onSuccess: (data) => {
      console.log(`New Stats ${data}`);

      // Update the stats in the query cache
      queryClient.setQueryData(["stats"], (oldData: FinancialSummary) => {
        console.log(oldData);
        if (data) {
          const label = data.isExpense ? "expense" : "income";
          oldData[label]["sum"] = data.amount;
          oldData["total"]["sum"] += data.amount;
        }
        console.log(`Updated oldData ${JSON.stringify(oldData)}`);

        return oldData;
      });
    },
  });

  useEffect(() => {
    if (data) {
      setLocalState(data);
    }
  }, [data]);

  const onChangeEntries = (value: string, id: number) => {
    console.log("Try to change key with: ", value, id, localState);

    const newKeys = localState.map((k) => (k.id === id ? { ...k, value } : k));

    console.log("onChangeKeyes: ", newKeys);

    setLocalState(newKeys);
  };

  const ButtonCard = () => {
    return (
      <>
        <P className="text-secondary">ADD</P>
        <CirclePlus className="text-secondary ml-1" size={24} />
      </>
    );
  };
  return (
    <CommonCard
      description="Description Template"
      queryKey={QUERY_KEY}
      initialKeys={initialEntries}
      getKeysFromDb={getKeysFromDb}
      button={ButtonCard()}
      saveKeys={() => mutation.mutateAsync()}
    >
      {localState &&
        localState.map((d: Entry) => (
          <Fragment key={d.id}>
            <Label nativeID="inputLabel">{d.key}</Label>
            <Input
              keyboardType={
                d.key === "Amount" ? "numbers-and-punctuation" : "default"
              }
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
