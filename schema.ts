import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  name: text("name"),
});
