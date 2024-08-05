import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const template = sqliteTable("template", {
  id: integer("id").primaryKey(),
  amountColumnName: text("amountColumnName").$type<string>(),
  categoriesList: text("categoryList").$type<string>(),
  data: text("data").$type<string>(),
  status: integer("status", { mode: "boolean" }).notNull().default(false),
});

export type Data = {
  key: string;
  value: string;
};
export const entry = sqliteTable("entry", {
  id: integer("id").primaryKey(),
  isExpense: integer("isExpense", { mode: "boolean" }).notNull().default(true),
  month: text("month").$type<string>(),
  data: text("data", { mode: "json" }).$type<Data[]>(),
  amount: integer("amount"),
});
