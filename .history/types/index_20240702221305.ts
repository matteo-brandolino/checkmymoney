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
  title: string;
  description: string;
  sum: number;
};

// Helpers
export const isEntry = (
  arg: Data[] | Entry[] | DisplayData[] | null | undefined
): arg is Entry[] => {
  if (!arg) return false;
  return arg && arg.filter((element) => "key" in element).length === arg.length;
};

export type CommonCardType = {
  title?: string;
  description?: string;
  children: ReactNode;
  button: ReactNode;
  initialKeys?: Data[];
  queryKey: string;
  getKeysFromDb: QueryFn;
  saveKeys: () => Promise<void>;
};
