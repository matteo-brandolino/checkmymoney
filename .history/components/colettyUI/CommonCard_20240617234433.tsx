import { Check } from "lucide-react-native";
import { View, Text, useColorScheme } from "react-native";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Card,
} from "../ui/card";
import { CommonCardType } from "@/types";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { THEME } from "@/constants/Colors";
import { P } from "../ui/typography";
import { Button } from "../ui/button";

export default function CommonCard({
  title,
  description,
  children,
  initialKeys,
  queryKey,
  getKeysFromDb,
  saveKeys,
}: CommonCardType) {
  const colorScheme = useColorScheme();
  const { data, error, isError, isLoading } = useCustomQuery({
    queryKey: [queryKey],
    queryFn: getKeysFromDb,
    initialKeys: initialKeys ?? [],
  });
  if (isLoading) {
    console.log("Loading");

    return <Text>Loading...</Text>;
  }

  if (isError) {
    console.log("Error: ", error);

    return <Text>Error: {error.message}</Text>;
  }

  if (!data || data.length === 0) {
    return <Text>Error</Text>;
  }
  return (
    <View className="w-11/12 mx-auto">
      <Card className="rounded-3xl">
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <View className="flex flex-row justify-center">
            <Button
              className="flex flex-row justify-center items-center rounded-full"
              onPress={saveKeys}
            >
              <P className="text-secondary">Create Template</P>
              <Check
                className="ml-2"
                color={colorScheme ? THEME[colorScheme].secondary : "#FFF"}
                size={24}
                onPress={saveKeys}
              />
            </Button>
          </View>
        </CardFooter>
      </Card>
    </View>
  );
}
