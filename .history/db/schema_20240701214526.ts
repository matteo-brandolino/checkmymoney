import { sqliteTable, integer, text, blob } from "drizzle-orm/sqlite-core";

export const template = sqliteTable("template", {
  id: integer("id").primaryKey(),
  data: text("data").$type<string>(),
  status: integer("status", { mode: "boolean" }).notNull().default(false),
});

type Data = {
  key: string;
  value: string;
};
export const entry = sqliteTable("entry", {
  id: integer("id").primaryKey(),
  isExpense: integer("isExpense", { mode: "boolean" }).notNull().default(true),
  data: text("data", { mode: "json" }).$type<Data[]>(),
});
