import { db } from "@/db/client";
import { template } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { Data, TemplateLocalState } from "@/types";
import { View } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";

import { THEME } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { H4, P } from "@/components/ui/typography";
import { Stack, router } from "expo-router";
import DefaultButton from "@/components/colettyUI/DefaultButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdditionalFields from "./AdditionalFields";
import Fields from "./Fields";
import DotCarousel from "@/components/colettyUI/DotCarousel";

const QUERY_KEY = "keys-template";

export default function NewTemplate() {
  const insets = useSafeAreaInsets();

  const { colorScheme } = useColorScheme();

  const initialTemplate: TemplateLocalState = {
    amountColumnName: "amount",
    categoryColumnName: "category",
    monthColumnName: "month",
    categoriesList: ["food"],
    data: [
      {
        id: new Date().getTime(),
        value: "",
      },
    ],
  };
  const [localState, setLocalState] = useState(initialTemplate);

  const getTemplate = async (): Promise<TemplateLocalState> => {
    try {
      const dbResult = await db
        .select()
        .from(template)
        .where(eq(template.status, true));

      console.info("dbResult: ", dbResult);
      if (
        !dbResult ||
        !dbResult[0] ||
        !dbResult[0].data ||
        !dbResult[0].amountColumnName ||
        !dbResult[0].categoryColumnName ||
        !dbResult[0].categoriesList
      ) {
        return initialTemplate;
      }
      const splittedData = dbResult[0].data?.split(",");
      const splittedCategories = dbResult[0].categoriesList?.split(",");
      if (!splittedData || !splittedCategories) return initialTemplate;
      console.info(
        "splittedData: ",
        splittedData.map((r, i) => ({
          id: new Date().getTime() * (i + 1),
          value: r,
        }))
      );

      const data = splittedData.map((r, i) => ({
        id: new Date().getTime() * (i + 1),
        value: r,
      }));
      return {
        amountColumnName: dbResult[0].amountColumnName,
        categoryColumnName: dbResult[0].categoryColumnName,
        monthColumnName:
          dbResult[0].monthColumnName ?? initialTemplate.monthColumnName,
        categoriesList: splittedCategories,
        data,
      };
    } catch (error) {
      console.error("getTemplate: ", error);
      return initialTemplate;
    }
  };

  const { data } = useCustomQuery({
    queryKey: [QUERY_KEY],
    queryFn: getTemplate,
    initialKeys: initialTemplate,
  });

  if (!data) return null;

  useEffect(() => {
    if (data) {
      console.log(`Setting template local state ${JSON.stringify(data)}`);

      setLocalState(data);
    }
  }, [data]);

  const saveTemplate = async () => {
    const dataToSave = localState.data
      .filter((dtf) => dtf.value !== "")
      .map((d) => d.value)
      .join(",");
    const categoriesList = localState.categoriesList.join(",");
    const values = {
      data: dataToSave,
      amountColumnName: localState.amountColumnName,
      categoryColumnName: localState.categoryColumnName,
      monthColumnName: localState.monthColumnName,
      categoriesList,
      status: true,
    };
    console.info("Saving: ", JSON.stringify(values));

    if (dataToSave) {
      try {
        await db.transaction(async (tx) => {
          await tx
            .update(template)
            .set({ status: false })
            .where(eq(template.status, true));
          await tx.insert(template).values(values);
        });
      } catch (error) {
        console.info("saveTemplate: ", error);
      } finally {
        console.info("Saved");
        router.replace("/add");
      }
    }
  };

  //TODO component if colorscheme not existing
  if (!colorScheme) return null;

  return (
    <View
      style={{ paddingTop: insets.top * 2 }}
      className="w-4/5 mx-auto flex-1"
    >
      <Stack.Screen
        options={{
          headerTitle: "New Template",
        }}
      />
      <View className="mb-4">
        <H4 className="text-center">Create your budget tracker template</H4>
        <P className="text-center">Lorem ipsum dolor sit amet.</P>
      </View>
      <DotCarousel length={2}>
        <Fields
          setLocalState={setLocalState}
          color={THEME[colorScheme].primary}
          localState={localState}
        />
        <AdditionalFields
          color={THEME[colorScheme].primary}
          localState={localState}
          setLocalState={setLocalState}
        />
      </DotCarousel>

      <DefaultButton
        className="w-3/4 mx-auto sticky bottom-7"
        title="Create a template"
        onPress={saveTemplate}
      />
    </View>
  );
}
