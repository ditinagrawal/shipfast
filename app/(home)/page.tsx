"use client";

import { authClient } from "@/lib/auth-client";

const HomePage = () => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <div>Loading...</div>;
  return <pre>{session ? JSON.stringify(session, null, 2) : "No session"}</pre>;
};

export default HomePage;
