import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function NumericInput({
  value,
  onChange,
}: {
  value: {
    label: string;
    value: string;
  };
  onChange: React.Dispatch<
    React.SetStateAction<{
      label: string;
      value: string;
    } | null>
  >;
}) {
  return (
    <View className="flex-row justify-around">
      <Button
        className="rounded-3xl"
        onPress={() =>
          onChange((prev) => ({
            label: prev ? prev.label : "",
            value: prev ? String(parseFloat(prev.value) - 1) : "",
          }))
        }
      >
        <Text>-</Text>
      </Button>
      <Input
        className="basis-2/4 text-center border-0"
        onChangeText={(val) => onChange({ ...value, value: val })}
        keyboardType="numeric"
        value={String(value.value)}
      />
      <Button
        className="rounded-3xl"
        onPress={() =>
          onChange((prev) => ({
            label: prev ? prev.label : "",
            value: prev ? String(parseFloat(prev.value) + 1) : "",
          }))
        }
      >
        <Text>+</Text>
      </Button>
    </View>
  );
}
