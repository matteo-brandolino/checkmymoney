import { useQuery } from "@tanstack/react-query";
import { Data } from "@/types";

type UseCustomQueryType = {
  queryFn: () => Promise<Data[]>;
  initialKeys: Data[];
};

export const useCustomQuery = ({
  queryFn,
  initialKeys,
}: UseCustomQueryType) => {
  return useQuery({
    queryKey: ["keys"],
    queryFn: queryFn,
    initialData: initialKeys,
  });
};
