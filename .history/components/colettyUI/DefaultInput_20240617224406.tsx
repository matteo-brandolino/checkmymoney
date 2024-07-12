import { View, Text } from "react-native";
import React from "react";
import { Input } from "../ui/input";

type TextProps = Text["props"];

export default function DefaultInput(props: TextProps) {
  return (
    <View>
      <Input className="rounded-lg" {...props} />
    </View>
  );
}
