import { QueryFunction } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Data as DataSchema } from "@/db/schema";

export type Data = {
  id: number;
  value: string;
};
export type Entry = {
  id: number;
  key: string;
  value: string | string[] | Data[];
};
export type QueryFn =
  | (() => Promise<Data[]>)
  | (() => Promise<Entry[] | null>)
  | (() => Promise<DisplayData[] | null>);

export type DisplayData = {
  key: string;
  title: string;
  description: string;
  sum: number;
};
type SummaryDetail = {
  title: string;
  sum: number;
};

export type FinancialSummary = {
  total: SummaryDetail;
  income: SummaryDetail;
  expense: SummaryDetail;
};
export type DataList = {
  id: number;
  isExpense: boolean;
  data: DataSchema[] | null;
  month: string | null;
  amount: number | null;
  category: string | null;
};

export type AddTransactionCardType<T> = {
  title?: string;
  description?: string;
  children: ReactNode;
  saveTransaction: () => Promise<
    | {
        amount: {
          label: string;
          value: string;
        };
        isExpense: boolean;
      }
    | undefined
  >;
};

export type AppTheme = {
  dark: boolean;
  colors: {
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    popover: string;
    popoverForeground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    ring: string;
  };
};

export type ExcelData = { [key: string]: string | number }[];

export type DataToSave = {
  key: string;
  value: string;
}[];

export type TemplateLocalState = {
  amountColumnName: string;
  categoryColumnName: string;
  monthColumnName: string;
  categoriesList: string[];
  data: Data[];
};
