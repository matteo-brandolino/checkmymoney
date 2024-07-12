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
          <Button onPress={saveKeys}>
            <P className={colorScheme ? THEME[colorScheme].secondary : "#FFF"}>
              Create Template
            </P>
            <Check
              color={colorScheme ? THEME[colorScheme].secondary : "#FFF"}
              size={32}
              onPress={saveKeys}
            />
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
