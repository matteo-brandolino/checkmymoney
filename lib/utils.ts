import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "@/db/client";
import { entry, template as templateSchema } from "@/db/schema";
import { DataToSave, TemplateLocalState } from "@/types";
import { eq } from "drizzle-orm";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function saveEntry({
  dataToSave,
  idx,
  useAI,
  template,
}: {
  dataToSave: DataToSave;
  idx?: number;
  useAI?: boolean;
  template: {
    amountColumnName: string | null;
    categoryColumnName: string | null;
    monthColumnName: string | null;
    categoriesList: string | null;
    data: string | null;
  };
}) {
  if (dataToSave) {
    try {
      //todo refactor
      //todo add month field?
      //todo find Amount Field with AI?
      //todo find Month Field with AI? If it not existing, create
      if (!useAI) {
        const amountId = dataToSave.findIndex(
          (d) =>
            d.key.toLowerCase() === template.amountColumnName?.toLowerCase()
        );
        if (amountId === -1) throw new Error("Cannot find an amount column");
        const amountObj = dataToSave.splice(amountId, 1)[0];
        if (!amountObj) throw new Error("Amount Obj doesn't exist");

        const categoryId = dataToSave.findIndex(
          (d) =>
            d.key.toLowerCase() === template.categoryColumnName?.toLowerCase()
        );
        if (categoryId === -1)
          throw new Error(
            `Cannot find an category column with ${template.categoryColumnName}}`
          );

        const categoryObj = dataToSave.splice(categoryId, 1)[0];
        if (!categoryObj) throw new Error("Category Obj doesn't exist");

        const { value: newCategory } = categoryObj;
        const categoriesListArray = template.categoriesList?.split(",");

        console.log(`Saving newCategory ${newCategory}`);
        if (categoriesListArray && !categoriesListArray.includes(newCategory)) {
          const newCategories = [...categoriesListArray, newCategory];
          console.log(`Saving newCategories ${newCategories}`);

          await db
            .update(templateSchema)
            .set({ categoriesList: newCategories.join(",") })
            .where(eq(templateSchema.status, true));
        }

        const monthId = dataToSave.findIndex(
          (d) => d.key.toLowerCase() === template.monthColumnName?.toLowerCase()
        );
        console.log(`Month Id found ${monthId}`);

        const monthObj = dataToSave.splice(monthId, 1)[0];

        const { value: amountValue } = amountObj;
        const amount = parseInt(amountValue);
        const isExpense = amount < 0;

        const templateData = template.data
          ? template.data.split(",").map((t) => t.toLowerCase())
          : [];

        const data = dataToSave.filter((d) =>
          templateData.includes(d.key.toLowerCase())
        );
        const entryToSave = {
          data: data,
          isExpense,
          category: newCategory,
          amount: amount,
          month:
            (monthObj && monthObj.value) ??
            new Date().toISOString().split("T")[0],
        };
        console.log(`Saving entry ${JSON.stringify(entryToSave)}`);

        await db.insert(entry).values(entryToSave);
        return { amount, isExpense, idx };
      }
    } catch (error) {
      console.log("Error saveKeys: ", error);
    } finally {
      console.log("Done");
    }
  }
}

const initialTemplate: TemplateLocalState = {
  amountColumnName: "Amount",
  categoryColumnName: "Category",
  monthColumnName: "Month",
  categoriesList: [],
  data: [
    {
      id: new Date().getTime(),
      value: "",
    },
  ],
};

export async function getTemplate(): Promise<TemplateLocalState> {
  try {
    const dbResult = await db
      .select()
      .from(templateSchema)
      .where(eq(templateSchema.status, true));

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
}
