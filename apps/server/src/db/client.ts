import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/edumanage";

export const pool = new pg.Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool);

