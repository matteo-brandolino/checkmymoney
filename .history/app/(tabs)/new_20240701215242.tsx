import { Button } from "@/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Check, CirclePlus } from "@/components/Icons";
import { db } from "@/db/client";
import { template } from "@/db/schema";
import { eq } from "drizzle-orm";
import CommonCard from "@/components/colettyUI/CommonCard";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { Data } from "@/types";
import { isEntry } from "./add";
import DefaultInput from "@/components/colettyUI/DefaultInput";
import { ScrollView, View, useColorScheme } from "react-native";
import { THEME } from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import { P } from "@/components/ui/typography";

const QUERY_KEY = "keys-template";

export default function NewTemplate() {
  const scrollViewRef = useRef<ScrollView>(null);
  const colorScheme = useColorScheme();

  const initialKeys: Data[] = [
    {
      id: new Date().getTime(),
      value: "",
    },
  ];
  const [localState, setLocalState] = useState(initialKeys);

  const getKeysFromDb = async (): Promise<Data[]> => {
    try {
      const dbResult = await db
        .select({ data: template.data, id: template.id })
        .from(template)
        .where(eq(template.status, true));

      console.log("dbResult: ", dbResult);
      if (!dbResult || !dbResult[0] || !dbResult[0].data) {
        return initialKeys;
      }
      const splittedDbResult = dbResult[0].data?.split(",");
      if (!splittedDbResult) return initialKeys;
      console.log(
        "splittedDbResult: ",
        splittedDbResult.map((r, i) => ({
          id: new Date().getTime() * (i + 1),
          value: r,
        }))
      );

      return splittedDbResult.map((r, i) => ({
        id: new Date().getTime() * (i + 1),
        value: r,
      }));
    } catch (error) {
      console.error("getKeysFromDb: ", error);
      return initialKeys;
    }
  };

  const { data } = useCustomQuery({
    queryKey: [QUERY_KEY],
    queryFn: getKeysFromDb,
    initialKeys,
  });

  if (isEntry(data) || !data) return null;

  useEffect(() => {
    if (data) {
      setLocalState(data);
    }
  }, [data]);

  const onAddNewKey = async () => {
    const newKeys = [...localState, { id: new Date().getTime(), value: "" }];
    console.log(newKeys);
    setLocalState(newKeys);
  };

  const onChangeKeys = async (value: string, id: number) => {
    console.log("Try to change key with: ", value, id, localState);

    const newKeys = localState.map((k) => (k.id === id ? { id, value } : k));

    console.log("onChangeKeyes: ", newKeys);

    setLocalState(newKeys);
  };

  const saveKeys = async () => {
    const dataToSave = localState.map((d) => d.value).join(",");
    console.log("Saving: ", dataToSave);
    if (dataToSave) {
      try {
        await db.transaction(async (tx) => {
          await tx
            .update(template)
            .set({ status: false })
            .where(eq(template.status, true));
          await tx.insert(template).values({ data: dataToSave, status: true });
        });
      } catch (error) {
        console.log("saveKeys: ", error);
      } finally {
        console.log("Saved");
      }
    }
  };
  function scrollViewSizeChanged(height: number) {
    // y since we want to scroll vertically, use x and the width-value if you want to scroll horizontally
    scrollViewRef &&
      scrollViewRef.current?.scrollTo({ y: height, animated: true });
  }
  //TODO component if colorscheme not existing
  if (!colorScheme) return null;

  const ButtonCard = () => {
    return (
      <>
        <P className="text-secondary">Create Template</P>
        <Check className="text-secondary ml-1" size={24} />
      </>
    );
  };
  return (
    <CommonCard
      description="Description Template"
      button={ButtonCard()}
      queryKey={QUERY_KEY}
      initialKeys={initialKeys}
      getKeysFromDb={getKeysFromDb}
      saveKeys={saveKeys}
    >
      {/* <Switch
        checked={true}
        onCheckedChange={() => console.log("here")}
        nativeID="is-expense"
      /> */}
      <Label
        nativeID="is-expense"
        onPress={() => {
          console.log("here");
        }}
      >
        Airplane Mode
      </Label>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={(_, height) => {
          scrollViewSizeChanged(height);
        }}
      >
        {localState &&
          localState.map((k) => (
            <View className="my-2" key={k.id}>
              <DefaultInput
                placeholder="Write some stuff..."
                value={k.value}
                onChangeText={(value) => onChangeKeys(value, k.id)}
                aria-labelledbyledBy="inputLabel"
                aria-errormessage="inputError"
              />
            </View>
          ))}
      </ScrollView>
      <View className="my-2 flex flex-row justify-end">
        <Button size="icon" variant="ghost" onPress={onAddNewKey}>
          <CirclePlus color={THEME[colorScheme].primary} size={32} />
        </Button>
      </View>
    </CommonCard>
  );
}
