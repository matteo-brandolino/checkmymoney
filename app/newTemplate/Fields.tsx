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

  const addCategory = () => {
    if (tempCategory !== "") {
      setLocalState({
        ...localState,
        categoriesList: [...localState.categoriesList, tempCategory],
      });
      setTempCategory("");
    }
  };
  const removeCategory = (index: number) => {
    setLocalState({
      ...localState,
      categoriesList: localState.categoriesList
        .filter((c) => c !== "")
        .filter((_, i) => i !== index),
    });
  };

  return (
    <View className="flex-1">
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
      </View>
      <View className="mb-7">
        <Label nativeID="categoriesList" className="pb-3.5">
          Category Column Name
        </Label>
        <DefaultInput
          onChangeText={(value) =>
            setLocalState({ ...localState, categoryColumnName: value })
          }
          placeholder="Write some stuff..."
          value={localState.categoryColumnName}
          aria-labelledbyledBy="inputLabel"
          aria-errormessage="inputError"
        />
        <View className="mt-6 flex-row justify-between items-end">
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
        <View className="flex-row flex-wrap mt-2">
          {localState.categoriesList
            ?.filter((c) => c !== "")
            .map((c, index) => (
              <Badge key={index} className="mr-2 mt-2">
                <TouchableOpacity onPress={() => removeCategory(index)}>
                  <Text className="text-background">{c}</Text>
                </TouchableOpacity>
              </Badge>
            ))}
        </View>
      </View>
      <View>
        <Label nativeID="categoriesList" className="pb-3.5">
          Date Column Name
        </Label>
        <DefaultInput
          onChangeText={(value) =>
            setLocalState({ ...localState, monthColumnName: value })
          }
          placeholder="Write some stuff..."
          value={localState.monthColumnName}
          aria-labelledbyledBy="inputLabel"
          aria-errormessage="inputError"
        />
      </View>
    </View>
  );
}
