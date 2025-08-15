"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { GitHubIcon, GoogleIcon } from "./icons";

export const LoginForm = () => {
  const router = useRouter();
  const [isGithub, startGithub] = useTransition();
  const [isGoogle, startGoogle] = useTransition();
  const [isEmail, startEmail] = useTransition();
  const [email, setEmail] = useState("");
  async function signInWithGithub() {
    startGithub(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Login with Github successful. Redirecting to dashboard..."
            );
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }
  async function signInWithGoogle() {
    startGoogle(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Login with Google successful. Redirecting to dashboard..."
            );
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }
  async function signInWithEmail() {
    startEmail(async () => {
      if (!email) {
        toast.error("Email is required");
        return;
      }
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("OTP sent to email");
            router.push(`/auth/verify?email=${email}`);
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Github or Email account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signInWithGoogle()}
                  disabled={isGoogle || isEmail || isGithub}
                >
                  {isGoogle ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Loading...
                    </>
                  ) : (
                    <>
                      <GoogleIcon className="size-4" /> Login with Google
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => signInWithGithub()}
                  disabled={isGithub || isEmail || isGoogle}
                >
                  {isGithub ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Loading...
                    </>
                  ) : (
                    <>
                      <GitHubIcon className="size-4" /> Login with Github
                    </>
                  )}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isEmail || isGithub || isGoogle}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  onClick={signInWithEmail}
                  disabled={isEmail || isGithub || isGoogle}
                >
                  {isEmail ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Loading...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" /> Login with Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
