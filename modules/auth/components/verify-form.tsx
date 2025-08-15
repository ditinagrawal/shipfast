"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2, MailCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const VerifyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;
  const [isVerify, startVerify] = useTransition();
  const [otp, setOtp] = useState("");

  async function handleVerify() {
    startVerify(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified. Redirecting to dashboard...");
            router.push("/dashboard");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verify your email</CardTitle>
        <CardDescription>
          We sent a verification code to your email. Please check your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={isVerify}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <Button
          className="w-full"
          onClick={handleVerify}
          disabled={isVerify || otp.length !== 6}
        >
          {isVerify ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Verifying..
            </>
          ) : (
            <>
              <MailCheck className="size-4" /> Verify Email
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
