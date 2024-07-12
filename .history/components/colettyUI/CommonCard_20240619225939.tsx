import { Check } from "lucide-react-native";
import { View, Text } from "react-native";
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
    <View className="w-11/12 mx-auto flex-grow">
      <Card className="rounded-3x flex-grow my-8">
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="justify-center items-end">
          <Button
            className="rounded-full flex-row justify-between"
            onPress={saveKeys}
          >
            <P className="text-secondary">Create Template</P>
            <Check className="text-secondary ml-1" size={24} />
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
