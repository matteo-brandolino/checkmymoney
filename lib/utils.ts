import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "@/db/client";
import { entry } from "@/db/schema";
import { DataToSave } from "@/types";

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
