import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function createContext() {
  const user = await currentUser();
  return { db, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
