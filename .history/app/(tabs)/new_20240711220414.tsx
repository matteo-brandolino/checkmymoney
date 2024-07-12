import { Check, CirclePlus } from "@/components/Icons";
import { db } from "@/db/client";
import { template } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { Data } from "@/types";
import DefaultInput from "@/components/colettyUI/DefaultInput";
import { ScrollView, View } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";

import { THEME } from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import { H4, P } from "@/components/ui/typography";

const QUERY_KEY = "keys-template";

export default function NewTemplate() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colorScheme } = useColorScheme();

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

      console.info("dbResult: ", dbResult);
      if (!dbResult || !dbResult[0] || !dbResult[0].data) {
        return initialKeys;
      }
      const splittedDbResult = dbResult[0].data?.split(",");
      if (!splittedDbResult) return initialKeys;
      console.info(
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

  if (!data) return null;

  useEffect(() => {
    if (data) {
      setLocalState(data);
    }
  }, [data]);

  const onAddNewKey = async () => {
    const newKeys = [...localState, { id: new Date().getTime(), value: "" }];
    console.info(newKeys);
    setLocalState(newKeys);
  };

  const onChangeKeys = async (value: string, id: number) => {
    console.info("Try to change key with: ", value, id, localState);

    const newKeys = localState.map((k) => (k.id === id ? { id, value } : k));

    console.info("onChangeKeyes: ", newKeys);

    setLocalState(newKeys);
  };

  const saveKeys = async () => {
    const dataToSave = localState.map((d) => d.value).join(",");
    console.info("Saving: ", dataToSave);
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
        console.info("saveKeys: ", error);
      } finally {
        console.info("Saved");
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
    <View className="w-4/5 mx-auto">
      <View className="mb-4">
        <H4 className="text-center">Create your budget tracker template</H4>
        <P className="text-center">Lorem ipsum dolor sit amet.</P>
      </View>
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
        <View className="my-2 flex flex-row justify-end">
          <CirclePlus
            onPress={onAddNewKey}
            color={THEME[colorScheme].primary}
            size={32}
          />
        </View>
        <View className="my-8">
          <View className="my-2">
            <DefaultInput
              editable={false}
              placeholder="Write some stuff..."
              value={"Month"}
              aria-labelledbyledBy="inputLabel"
              aria-errormessage="inputError"
            />
            <View className="my-2">
              <DefaultInput
                editable={false}
                placeholder="Write some stuff..."
                value={"Amount"}
                aria-labelledbyledBy="inputLabel"
                aria-errormessage="inputError"
              />
            </View>
          </View>
        </View>
        <View className="border border-color-secondary">
          <P className="text-secondary">Create Template</P>
          <Check className="text-secondary ml-1" size={24} />
        </View>
      </ScrollView>
    </View>
  );
}
