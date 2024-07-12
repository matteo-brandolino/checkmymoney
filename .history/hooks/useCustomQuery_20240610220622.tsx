import { useQuery } from "@tanstack/react-query";

const getKeysFromDb = async (): Promise<Entry[] | null> => {
  try {
    const dbResult = await db
      .select({ data: template.data, id: template.id })
      .from(template)
      .where(eq(template.status, true));

    console.log("dbResult page two: ", dbResult);
    if (!dbResult || !dbResult[0] || !dbResult[0].data) {
      return null;
    }
    const splittedDbResult = dbResult[0].data?.split(",");
    if (!splittedDbResult) return null;
    console.log(
      "splittedDbResult: ",
      splittedDbResult.map((r, i) => ({
        id: new Date().getTime() * (i + 1),
        key: r,
        value: "",
      }))
    );

    return splittedDbResult.map((r, i) => ({
      id: new Date().getTime() * (i + 1),
      key: r,
      value: "",
    }));
  } catch (error) {
    console.error("getKeysFromDb: ", error);
    return null;
  }
};
export const useCustomQuery = () => {
  useQuery({
    queryKey: ["keys"],
    queryFn: getKeysFromDb,
  });
};
