import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button";
import { MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface iAuthProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: iAuthProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link
        href={"/"}
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}
      >
        <MoveLeftIcon className="size-4" /> Back
      </Link>
      <div className="flex flex-col w-full max-w-sm gap-6">
        <Link
          href={"/"}
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo className="size-5" />
          ShipFast
        </Link>
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
