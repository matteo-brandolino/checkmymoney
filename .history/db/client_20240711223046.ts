import { drizzle } from "drizzle-orm/expo-sqlite";
import { deleteDatabaseSync, openDatabaseSync } from "expo-sqlite/next";

deleteDatabaseSync("template.db");
const expoDb = openDatabaseSync("template.db");

export const db = drizzle(expoDb);
