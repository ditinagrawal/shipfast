"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function useSignOut() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const signOut = async () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error.error.message ?? "Failed to logout");
          },
        },
      });
    });
  };

  return { isPending, signOut };
}
