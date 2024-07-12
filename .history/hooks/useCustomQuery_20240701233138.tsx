import { useQuery } from "@tanstack/react-query";
import { Data, Entry, QueryFn } from "@/types";

type UseCustomQueryType = {
  queryKey: string[];
  queryFn: QueryFn;
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
