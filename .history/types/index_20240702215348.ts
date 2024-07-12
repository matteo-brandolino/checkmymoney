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
  | (() =>
      | Promise<null>
      | {
          title: string;
          description: string;
          sum: number;
        }[]);

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

export type DisplayData =
  | {
      title: string;
      description: string;
      sum: number;
    }[]
  | null;
