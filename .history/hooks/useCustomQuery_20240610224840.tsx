import { useQuery } from "@tanstack/react-query";
import { Data, GetKeysFromDbType } from "@/types";

type UseCustomQueryType = {
  queryFn: GetKeysFromDbType;
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
