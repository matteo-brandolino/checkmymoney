import { Fragment, useEffect, useState } from "react";
import { View } from "react-native";
import InputSpinner from "react-native-input-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddTransactionCard from "@/components/colettyUI/tabs/add/AddTransactionCard";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { entry, template } from "@/db/schema";
import { Entry } from "@/types";
import { DATA_LIST_QUERY_KEY, SUMMARY_QUERY_KEY } from ".";
import { useColorScheme } from "@/components/useColorScheme";
import { THEME } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const QUERY_KEY = "keys-entry";

export default function Add() {
  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();

  const initialEntries: Entry[] = [
    {
      id: new Date().getMilliseconds(),
      key: "Amount",
      value: "",
    },
  ];
  const initialMonth: Entry[] = [
    {
      id: new Date().getMilliseconds(),
      key: "Month",
      value: new Date().toLocaleString("default", { month: "long" }),
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
      return [...result, ...initialMonth, ...initialEntries];
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
        //todo refactor
        const amountObj = dataToSave.filter((d) => d.key === "Amount")[0];
        if (!amountObj) throw new Error("Amount Obj doesn't exist");

        const monthObj = dataToSave.filter((d) => d.key === "Month")[0];
        if (!monthObj) throw new Error("Month Obj doesn't exist");

        const { value: amountValue } = amountObj;
        const { value: month } = amountObj;
        const amount = parseInt(amountValue);
        const isExpense = amount < 0;
        await db.insert(entry).values({
          data: dataToSave,
          isExpense,
          amount: amount,
          month: month,
        });

        const resetKeys = localState.map((k) =>
          k.key === "Month" ? k : { ...k, value: "" }
        );

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
    onSuccess: async (data) => {
      console.log(`New Stats ${data}`);

      // Update the summary and data list in the query cache
      await queryClient.invalidateQueries({
        queryKey: [SUMMARY_QUERY_KEY],
      });

      await queryClient.invalidateQueries({
        queryKey: [DATA_LIST_QUERY_KEY],
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

  return (
    <View className="flex-1" style={{ paddingTop: insets.top * 2 }}>
      <AddTransactionCard
        title="Add Transaction"
        queryKey={QUERY_KEY}
        initialKeys={initialEntries}
        getKeysFromDb={getKeysFromDb}
        saveKeys={() => mutation.mutateAsync()}
      >
        {localState &&
          localState.map((d: Entry, idx) => (
            <Fragment key={idx}>
              <Label className="my-2" nativeID="inputLabel">
                {d.key}
              </Label>
              {d.key === "Amount" ? (
                <View className="mt-2">
                  <InputSpinner
                    type="float"
                    min={-999999}
                    color={THEME[colorScheme].primary}
                    value={d.value}
                    onChange={(value) => onChangeEntries(value as string, d.id)}
                  />
                </View>
              ) : (
                <Input
                  placeholder="Write some stuff..."
                  value={d.value}
                  onChangeText={(value) => onChangeEntries(value, d.id)}
                  aria-labelledbyledBy="inputLabel"
                  aria-errormessage="inputError"
                />
              )}
            </Fragment>
          ))}
      </AddTransactionCard>
    </View>
  );
}
