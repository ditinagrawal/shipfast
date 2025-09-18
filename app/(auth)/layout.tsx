import Link from "next/link";
import React from "react";

import { MoveLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href={"/"}
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "absolute top-4 left-4",
        })}
      >
        <MoveLeftIcon className="size-4" /> Back
      </Link>
      <div className="flex w-full max-w-sm flex-col gap-6">
        {children}
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our{" "}
          <Link href="#">Terms of Service</Link> and{" "}
          <Link href="#">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
