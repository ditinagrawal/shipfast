import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getUser(email: string) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      name: true,
      image: true,
    },
  });
  if (!user) {
    return null;
  }
  return user;
}

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/login");
  }
  const user = await getUser(session.user.email);
  if (!user) {
    redirect("/auth/login");
  }
  if (!user.name || !user.image) {
    redirect("/onboarding");
  }
  return <pre>{JSON.stringify(session.user, null, 2)}</pre>;
};

export default DashboardPage;
