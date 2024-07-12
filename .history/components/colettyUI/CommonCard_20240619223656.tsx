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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Card className="rounded-3x flex-auto my-5">
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-1">{children}</CardContent>
        <CardFooter className="justify-center flex-2">
          <Button
            className="rounded-full flex flex-row justify-between"
            onPress={saveKeys}
          >
            <P className="text-secondary">Create Template</P>
            <Check className="text-secondary ml-1" size={24} />
          </Button>
        </CardFooter>
      </Card>
    </KeyboardAvoidingView>
  );
}
