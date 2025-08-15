"use client";

import { authClient } from "@/lib/auth-client";

const HomePage = () => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <div>Loading...</div>;
  return <pre>{JSON.stringify(session, null, 2)}</pre>;
};

export default HomePage;
