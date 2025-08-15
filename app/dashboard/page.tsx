"use client";

import { authClient } from "@/lib/auth-client";

const DashboardPage = () => {
  const { data: session, isPending } = authClient.useSession();
  if (!session) return <div>Not authenticated</div>;
  if (isPending) return <div>Loading...</div>;
  return <pre>{JSON.stringify(session, null, 2)}</pre>;
};

export default DashboardPage;
