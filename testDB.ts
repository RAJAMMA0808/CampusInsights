import { db } from "./db";            // no .ts extension
import { students, faculty } from "./schema";

async function testDB() {
  try {
    const tables = { students, faculty };

    for (const [name, table] of Object.entries(tables)) {
      const rows = await db.select().from(table).limit(2);
      console.log(`\nTable: ${name}`);
      console.table(rows);
    }
  } catch (err) {
    console.error("Error connecting to DB:", err);
  }
}

testDB();
