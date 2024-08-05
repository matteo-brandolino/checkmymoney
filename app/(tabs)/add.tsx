import { Fragment, useEffect, useState } from "react";
import { View } from "react-native";
import InputSpinner from "react-native-input-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddTransactionCard from "@/components/colettyUI/tabs/add/AddTransactionCard";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/db/client";
import { entry } from "@/db/schema";
import { DATA_LIST_QUERY_KEY, SUMMARY_QUERY_KEY } from ".";
import { useColorScheme } from "@/components/useColorScheme";
import { THEME } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getTemplate } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

const QUERY_KEY = "keys-entry";

export default function Add() {
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  const { colorScheme } = useColorScheme();

  const [additionalFields, setAdditionalFields] = useState<
    { label: string; value: string; id: number }[] | null
  >(null);
  const [categoriesList, setCategoriesList] = useState<string[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [month, setMonth] = useState<string | null>(null);
  const [amount, setAmount] = useState<{ label: string; value: number } | null>(
    null
  );

  const { data } = useCustomQuery({
    queryKey: [QUERY_KEY],
    queryFn: getTemplate,
  });
  const onChangeAdditionalFields = (id: number, value: string) => {
    if (additionalFields) {
      let newAdditionalFields = [...additionalFields];
      newAdditionalFields = newAdditionalFields.map((ad) =>
        ad.id === id ? { ...ad, value } : ad
      );
      setAdditionalFields(newAdditionalFields);
    }
  };

  const saveTransaction = async () => {
    const dataToSave =
      additionalFields &&
      additionalFields.map((ad) => ({ key: ad.label, value: ad.value }));
    console.log("Saving: ", dataToSave);
    if (dataToSave && amount) {
      try {
        const isExpense = amount?.value < 0;
        await db.insert(entry).values({
          data: dataToSave,
          isExpense,
          amount: amount.value,
          month: month,
        });

        setAdditionalFields(
          additionalFields.map((ad) => ({ ...ad, value: "" }))
        );
        setAmount({ ...amount, value: 0 });
        setSelectedCategory("");
        return { amount, isExpense };
      } catch (error) {
        console.log("Error saveTransaction: ", error);
      } finally {
        console.log("Done");
      }
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveTransaction,
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
      setAdditionalFields(
        data.data.map((d) => ({ ...d, label: d.value, value: "" }))
      );
      setCategoriesList(data.categoriesList);
      setMonth(new Date().toLocaleString("default", { month: "long" }));
      setAmount({
        label: data.amountColumnName,
        value: 0,
      });
    }
  }, [data]);

  return (
    <View className="flex-1" style={{ paddingTop: insets.top * 2 }}>
      <AddTransactionCard
        title="Add Transaction"
        saveTransaction={() => mutation.mutateAsync()}
      >
        {additionalFields &&
          additionalFields.map((ad, idx) => (
            <Fragment key={idx}>
              <Label className="my-2" nativeID="inputLabel">
                {ad.label}
              </Label>
              <Input
                placeholder="Write some stuff..."
                value={ad.value}
                onChangeText={(value) => onChangeAdditionalFields(ad.id, value)}
                aria-labelledbyledBy="inputLabel"
                aria-errormessage="inputError"
              />
            </Fragment>
          ))}

        {categoriesList && (
          <Fragment>
            <Label className="my-2" nativeID="inputLabel">
              Category
            </Label>
            <Select
              onValueChange={(option) =>
                setSelectedCategory(option ? option.value : "")
              }
              value={{
                label: selectedCategory
                  ? `${selectedCategory[0].toUpperCase()}${selectedCategory.substring(
                      1
                    )}`
                  : "Select a category",
                value: selectedCategory,
              }}
            >
              <SelectTrigger>
                <SelectValue
                  className="text-sm native:text-lg"
                  placeholder="Select a category"
                />
              </SelectTrigger>
              <SelectContent insets={contentInsets} className="mt-1">
                <SelectGroup>
                  {categoriesList.map((c, index) => (
                    <SelectItem
                      key={index}
                      label={`${c[0].toUpperCase()}${c.substring(1)}`}
                      value={c}
                    >
                      {c}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Fragment>
        )}
        {month && (
          <Fragment>
            <Label className="my-2" nativeID="inputLabel">
              Month
            </Label>
            <Input
              placeholder="Write some stuff..."
              value={month}
              onChangeText={(value) => setMonth(value)}
              aria-labelledbyledBy="inputLabel"
              aria-errormessage="inputError"
            />
          </Fragment>
        )}
        {amount && (
          <Fragment>
            <View className="mt-2">
              <Label className="my-2" nativeID="inputLabel">
                {amount.label}
              </Label>
              <InputSpinner
                type="float"
                min={-999999}
                color={THEME[colorScheme].primary}
                value={amount.value}
                onChange={(value) =>
                  setAmount({ label: amount.label, value: value as number })
                }
              />
            </View>
          </Fragment>
        )}
      </AddTransactionCard>
    </View>
  );
}
