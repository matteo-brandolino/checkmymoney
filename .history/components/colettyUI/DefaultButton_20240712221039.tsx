import { View, Button as Btn } from "react-native";
import { Button } from "@/components/ui/button";
import React from "react";
import { Check } from "lucide-react-native";
import { P } from "../ui/typography";

type ButtonProps = {
  className: string;
  title: string;
  props?: Btn["props"];
  saveKeys: () => Promise<void>;
};

export default function DefaultButton({
  className,
  title,
  saveKeys,
  ...props
}: ButtonProps) {
  return (
    <Button onPress={saveKeys} className={className} {...props}>
      <View className="flex-row justify-center items-center w-full">
        <P className="color-background mr-1">{title}</P>
        <Check className="text-background" size={24} />
      </View>
    </Button>
  );
}
