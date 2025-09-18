import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export default async function SyncUser() {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const existingUser = await db.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!existingUser) {
    await db.user.create({
      data: {
        clerkId: user.id,
        name: user.fullName || "",
        email: user.emailAddresses[0].emailAddress || "",
        image: user.imageUrl || "",
      },
    });
  }
  return redirect("/");
}
