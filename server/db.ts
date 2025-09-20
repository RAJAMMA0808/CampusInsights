import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from "@shared/schema";

// Use local SQLite database for development
const databaseUrl = process.env.DATABASE_URL || 'file:./campusinsights.db';

let db;

if (databaseUrl.startsWith('file:')) {
  // Local SQLite configuration
  const client = createClient({
    url: databaseUrl
  });
  db = drizzle(client, { schema });
} else {
  // PostgreSQL configuration (for production)
  const { Pool, neonConfig } = await import('@neondatabase/serverless');
  const ws = await import("ws");
  
  neonConfig.webSocketConstructor = ws.default;
  const pool = new Pool({ connectionString: databaseUrl });
  db = drizzle({ client: pool, schema });
}

export { db };