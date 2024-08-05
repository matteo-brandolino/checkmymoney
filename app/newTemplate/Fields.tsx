import { CirclePlus } from "@/components/Icons";
import DefaultInput from "@/components/colettyUI/DefaultInput";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { TemplateLocalState } from "@/types";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

type FieldsProps = {
  localState: TemplateLocalState;
  setLocalState: React.Dispatch<React.SetStateAction<TemplateLocalState>>;
  color: string;
};
export default function Fields({
  localState,
  setLocalState,
  color,
}: FieldsProps) {
  const [tempCategory, setTempCategory] = useState("");
  console.log(localState);

  const addCategory = () => {
    setLocalState({
      ...localState,
      categoriesList: [...localState.categoriesList, tempCategory],
    });
    setTempCategory("");
  };
  const removeCategory = (index: number) => {
    console.log(localState.categoriesList.splice(index, 1));

    setLocalState({
      ...localState,
      categoriesList: localState.categoriesList.splice(index, 1),
    });
  };
  return (
    <View>
      <View className="mb-7">
        <Label nativeID="amount" className="pb-3.5">
          Amount Column Name
        </Label>
        <DefaultInput
          onChangeText={(value) =>
            setLocalState({ ...localState, amountColumnName: value })
          }
          placeholder="Write some stuff..."
          value={localState.amountColumnName}
          aria-labelledbyledBy="inputLabel"
          aria-errormessage="inputError"
        />
        <Text
          nativeID="amount"
          className="text-sm text-muted-foreground pt-3.5"
        >
          Column that contains the transaction amount
        </Text>
      </View>
      <View className="mb-7">
        <View className="flex-row justify-between items-end">
          <View className="basis-3/4">
            <Label nativeID="categoriesList" className="pb-3.5">
              Categories List
            </Label>
            <DefaultInput
              onChangeText={(value) => setTempCategory(value)}
              placeholder="Write some stuff..."
              value={tempCategory}
              aria-labelledbyledBy="inputLabel"
              aria-errormessage="inputError"
            />
          </View>
          <CirclePlus onPress={addCategory} color={color} size={32} />
        </View>
        <View className="flex-row mt-2">
          {localState.categoriesList?.map((c, index) => (
            <Badge key={index} className="mr-2">
              <TouchableOpacity onPress={() => removeCategory(index)}>
                <Text>{c}</Text>
              </TouchableOpacity>
            </Badge>
          ))}
        </View>
      </View>
    </View>
  );
}
