import { Check } from "lucide-react-native";
import { View, Text, SafeAreaView } from "react-native";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Card,
} from "../ui/card";
import { AddEntryCardType } from "@/types";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { Button } from "../ui/button";

export default function AddEntryCard({
  title,
  description,
  button,
  initialKeys,
  queryKey,
  getKeysFromDb,
  saveKeys,
  children,
}: AddEntryCardType<void>) {
  const { data, error, isError, isLoading } = useCustomQuery({
    queryKey: [queryKey],
    queryFn: getKeysFromDb,
    initialKeys: initialKeys ?? [],
  });

  if (isLoading) {
    console.info("Loading");

    return <Text>Loading...</Text>;
  }

  if (isError) {
    console.info("Error: ", error);

    return <Text>Error: {error.message}</Text>;
  }

  if (!data || data.length === 0) {
    return <Text>Error</Text>;
  }
  return (
    <SafeAreaView className="w-11/12 mx-auto flex-1">
      <Card className="rounded-3x flex-1 my-4 bg-background border border-primary">
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-[32]">{children}</CardContent>
        <CardFooter className="flex-auto flex-col justify-end">
          {button && (
            <Button
              className="rounded-full flex-row justify-between color-background"
              onPress={saveKeys}
            >
              <P className="text-secondary">ADD</P>
              <CirclePlus className="text-secondary ml-1" size={24} />
            </Button>
          )}
        </CardFooter>
      </Card>
    </SafeAreaView>
  );
}
