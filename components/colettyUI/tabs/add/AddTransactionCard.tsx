import { SafeAreaView } from "react-native";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Card,
} from "../../../ui/card";
import { AddTransactionCardType, Entry } from "@/types";
import DefaultButton from "../../DefaultButton";
import { HandCoinsIcon } from "@/components/Icons";

export default function AddTransactionCard({
  title,
  saveTransaction,
  children,
}: AddTransactionCardType<Entry[] | null>) {
  return (
    <SafeAreaView className="w-11/12 mx-auto flex-1">
      <Card className="rounded-3x flex-1 my-4 bg-background">
        <CardHeader>{title && <CardTitle>{title}</CardTitle>}</CardHeader>
        <CardContent className="flex-[32]">{children}</CardContent>
        <CardFooter className="flex-auto flex-col justify-end">
          <DefaultButton
            icon={<HandCoinsIcon className="text-background" size={16} />}
            className="w-3/4 sticky bottom-0"
            title="Save Transaction"
            onPress={saveTransaction}
          />
        </CardFooter>
      </Card>
    </SafeAreaView>
  );
}
