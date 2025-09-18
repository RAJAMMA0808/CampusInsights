import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",   // <-- correct path
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
