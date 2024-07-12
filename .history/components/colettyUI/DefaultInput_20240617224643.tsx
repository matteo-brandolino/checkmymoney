import { View, TextInput } from "react-native";
import React from "react";
import { Input } from "../ui/input";

type TextProps = TextInput["props"];

export default function DefaultInput(props: TextProps) {
  return (
    <View>
      <Input className="rounded-2xl focus:ring-violet-300" {...props} />
    </View>
  );
}
