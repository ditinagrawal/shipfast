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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Dropzone from "@/modules/file-upload/components/dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { onboardingAction } from "../action";
import { onboardingSchema, OnboardingSchemaType } from "../zod-schema";

export const OnboardForm = () => {
  const router = useRouter();
  const [isOnboarding, startOnboarding] = useTransition();

  const form = useForm<OnboardingSchemaType>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const onSubmit = async (values: OnboardingSchemaType) => {
    startOnboarding(async () => {
      const { data, error } = await onboardingAction(values);
      if (data === "success" && !error) {
        toast.success("Onboarding successful. Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        toast.error(error?.toString() ?? "An unknown error occurred");
      }
    });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-md mx-auto">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">You&apos;re almost there!</CardTitle>
          <CardDescription>
            We just need a few more details to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        {...field}
                        disabled={isOnboarding}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <Dropzone value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormDescription>
                      This is your profile image. You can change it later.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isOnboarding}>
                {isOnboarding ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <span>Submit</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
