import { View, PressableProps } from "react-native";
import { Button } from "@/components/ui/button";
import React from "react";
import { Check } from "lucide-react-native";
import { P } from "../ui/typography";

interface ButtonProps extends PressableProps {
  title: string;
  icon?: JSX.Element;
}

export default function DefaultButton({ title, icon, ...props }: ButtonProps) {
  return (
    <Button {...props}>
      <View className="flex-row justify-center items-center">
        <P className="color-background mr-1">{title}</P>
        {icon ? icon : <Check className="text-background" size={24} />}
      </View>
    </Button>
  );
}
