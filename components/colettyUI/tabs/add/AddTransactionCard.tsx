import { Text, SafeAreaView } from "react-native";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Card,
} from "../../../ui/card";
import { AddTransactionCardType, Entry } from "@/types";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import DefaultButton from "../../DefaultButton";

export default function AddTransactionCard({
  title,
  initialKeys,
  queryKey,
  getKeysFromDb,
  saveKeys,
  children,
}: AddTransactionCardType<Entry[] | null>) {
  const { data, error, isError, isLoading } = useCustomQuery({
    queryKey: [queryKey],
    queryFn: getKeysFromDb,
    initialKeys: initialKeys,
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
      <Card className="rounded-3x flex-1 my-4 bg-background">
        <CardHeader>{title && <CardTitle>{title}</CardTitle>}</CardHeader>
        <CardContent className="flex-[32]">{children}</CardContent>
        <CardFooter className="flex-auto flex-col justify-end">
          <DefaultButton
            className="w-3/4 sticky bottom-0"
            title="Add"
            onPress={saveKeys}
          />
        </CardFooter>
      </Card>
    </SafeAreaView>
  );
}
