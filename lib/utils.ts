import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "@/db/client";
import { entry, template } from "@/db/schema";
import { DataToSave, TemplateLocalState } from "@/types";
import { eq } from "drizzle-orm";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function saveEntry({
  dataToSave,
  idx,
}: {
  dataToSave: DataToSave;
  idx?: number;
}) {
  console.log("Saving: ", dataToSave);
  if (dataToSave) {
    try {
      //todo refactor
      //todo find Amount Field with AI?
      //todo find Month Field with AI? If it not existing, create
      const amountObj = dataToSave.filter((d) => d.key === "Importo")[0];
      if (!amountObj) throw new Error("Amount Obj doesn't exist");

      let monthObj = dataToSave.filter((d) => d.key === "Month")[0];
      // Force Month, it should not happens
      if (!monthObj) {
        const d = new Date();
        let month = months[d.getMonth()];
        monthObj = {
          key: "Month",
          value: month,
        };
      }

      const { value: amountValue } = amountObj;
      const { value: month } = monthObj;
      const amount = parseInt(amountValue);
      const isExpense = amount < 0;
      await db.insert(entry).values({
        data: dataToSave,
        isExpense,
        amount: amount,
        month: month,
      });
      return { amount, isExpense, idx };
    } catch (error) {
      console.log("Error saveKeys: ", error);
    } finally {
      console.log("Done");
    }
  }
}

const initialTemplate: TemplateLocalState = {
  amountColumnName: "Amount",
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
      .from(template)
      .where(eq(template.status, true));

    console.info("dbResult: ", dbResult);
    if (
      !dbResult ||
      !dbResult[0] ||
      !dbResult[0].data ||
      !dbResult[0].amountColumnName ||
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
      categoriesList: splittedCategories,
      data,
    };
  } catch (error) {
    console.error("getTemplate: ", error);
    return initialTemplate;
  }
}
