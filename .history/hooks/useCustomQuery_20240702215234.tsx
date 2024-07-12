import { useQuery } from "@tanstack/react-query";
import { Data, DisplayData, Entry, QueryFn } from "@/types";

type UseCustomQueryType = {
  queryKey: string[];
  queryFn: QueryFn;
  initialKeys?: Data[] | Entry[] | DisplayData;
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
