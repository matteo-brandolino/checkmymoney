import { useQuery } from "@tanstack/react-query";
import { Data, Entry } from "@/types";

type UseCustomQueryType = {
  queryFn: () => Promise<Entry[] | null>;
  initialKeys: Data[];
};

export const useCustomQuery = ({
  queryFn,
  initialKeys,
}: UseCustomQueryType) => {
  useQuery({
    queryKey: ["keys"],
    queryFn: queryFn,
    initialData: initialKeys,
  });
};
