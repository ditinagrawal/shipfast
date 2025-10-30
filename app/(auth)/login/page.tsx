"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({ provider: "github", callbackURL: "/" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-full items-center justify-center">
      <Button onClick={handleLogin} disabled={loading}>
        {loading ? "Please wait.." : "Login with Github"}
      </Button>
    </div>
  );
}
