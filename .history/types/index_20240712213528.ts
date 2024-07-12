import { ReactNode } from "react";

export type Data = {
  id: number;
  value: string;
};
export type Entry = {
  id: number;
  key: string;
  value: string;
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
export type AddEntryCardType<K> = {
  title?: string;
  description?: string;
  children: ReactNode;
  button: ReactNode;
  initialKeys?: Data[];
  queryKey: string;
  getKeysFromDb: QueryFn;
  saveKeys: () => Promise<{ amount: number; isExpense: boolean } | undefined>;
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
