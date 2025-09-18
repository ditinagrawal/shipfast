import Link from "next/link";

import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Button asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
      <UserButton />
    </div>
  );
}
