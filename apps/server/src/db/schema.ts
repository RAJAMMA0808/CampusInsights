import { pgTable, serial, text, pgEnum, integer, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["chairman", "hod", "staff"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email"),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const colleges = pgTable("colleges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  collegeId: integer("college_id"),
  name: text("name").notNull(),
});

// Minimal session table for connect-pg-simple
export const session = pgTable("session", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire", { withTimezone: true }).notNull(),
});

