import { QueryFunction, UseQueryResult, useQuery } from "@tanstack/react-query";

type UseCustomQueryType<T> = {
  queryKey: string[];
  queryFn: QueryFunction<T, string[]>;
  initialKeys?: T;
};

export const useCustomQuery = <T>({
  queryKey,
  queryFn,
  initialKeys,
}: UseCustomQueryType<T>): UseQueryResult<T, Error> => {
  return useQuery({
    queryKey,
    queryFn,
    initialData: initialKeys,
  });
};
