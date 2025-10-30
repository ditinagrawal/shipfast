import { headers } from "next/headers";
import Link from "next/link";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Link href="/login">Login</Link>
      </div>
    );
  }
  const allUsers = await db.select().from(user);
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p>Session information</p>
        <pre>{JSON.stringify(session?.user, null, 2)}</pre>
      </div>
      <div className="space-y-2">
        <p>All Users from the database</p>
        <pre>{JSON.stringify(allUsers, null, 2)}</pre>
      </div>
    </div>
  );
}
