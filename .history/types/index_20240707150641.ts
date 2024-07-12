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

export type CommonCardType<K> = {
  title?: string;
  description?: string;
  children: ReactNode;
  button: ReactNode;
  initialKeys?: Data[];
  queryKey: string;
  getKeysFromDb: QueryFn;
  saveKeys: () => Promise<K>;
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
