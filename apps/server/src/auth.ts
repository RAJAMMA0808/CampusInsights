import { compare, hash } from "bcryptjs";
import { db } from "./db/client.js";
import { users } from "./db/schema.js";
import { eq } from "drizzle-orm";

export async function createUser(username: string, email: string | null, password: string, role: "chairman" | "hod" | "staff") {
  const passwordHash = await hash(password, 10);
  await db.insert(users).values({ username, email: email ?? undefined, passwordHash, role });
}

export async function verifyUser(username: string, password: string) {
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  const user = result[0];
  if (!user) return null;
  const ok = await compare(password, (user as any).passwordHash);
  if (!ok) return null;
  return { id: (user as any).id, username: (user as any).username, role: (user as any).role };
}

