import { useQuery } from "@tanstack/react-query";
import { db } from "@/db/client";
import { template } from "@/db/schema";
import { Data, Entry } from "@/types";
import { eq } from "drizzle-orm";

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
