import { Text, View } from "react-native";
import React from "react";

export default function DefaultInput() {
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
