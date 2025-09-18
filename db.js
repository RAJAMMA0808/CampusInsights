import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "yourpassword",
    database: "campusinsights",
});
export const db = drizzle(pool);
export { pool };
