import { db } from "./db"; // db.ts in same folder
import { students, faculty } from "./schema"; // schema.ts in same folder
async function testDB() {
    try {
        const tables = { students, faculty };
        for (const [name, table] of Object.entries(tables)) {
            const rows = await db.select().from(table).limit(2);
            console.log(`\nTable: ${name}`);
            console.table(rows);
        }
    }
    catch (err) {
        console.error("Error connecting to DB:", err);
    }
}
testDB();
