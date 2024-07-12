import { View, Text } from "react-native";
import React from "react";
import { Input } from "../ui/input";

export type TextProps = Text["props"];

export default function DefaultInput(props: TextProps) {
  return (
    <View>
      <Input
        placeholder="Write some stuff..."
        value={k.value}
        onChangeText={(value) => onChangeKeys(value, k.id)}
        aria-labelledbyledBy="inputLabel"
        aria-errormessage="inputError"
      />
    </View>
  );
}
