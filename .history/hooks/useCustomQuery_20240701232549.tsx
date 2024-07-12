import { useQuery } from "@tanstack/react-query";
import { Data, Entry, GetKeysFromDbType } from "@/types";

type UseCustomQueryType = {
  queryKey: string[];
  queryFn: GetKeysFromDbType | Promise<string>;
  initialKeys?: Data[] | Entry[];
};

export const useCustomQuery = ({
  queryKey,
  queryFn,
  initialKeys,
}: UseCustomQueryType) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: queryFn,
    initialData: initialKeys,
  });
};
