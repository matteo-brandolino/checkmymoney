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
export type GetKeysFromDbType =
  | (() => Promise<Data[]>)
  | (() => Promise<Entry[] | null>);
export type CommonCardType = {
  title?: string;
  description?: string;
  children: ReactNode;
  button: JSX.Element;
  initialKeys?: Data[];
  queryKey: string;
  getKeysFromDb: GetKeysFromDbType;
  saveKeys: () => Promise<void>;
};
