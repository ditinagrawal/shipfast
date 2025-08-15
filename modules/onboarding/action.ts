"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ActionResult } from "@/lib/types";
import { headers } from "next/headers";
import { onboardingSchema, OnboardingSchemaType } from "./zod-schema";

export const onboardingAction = async (
  values: OnboardingSchemaType
): ActionResult<string, string> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { data: null, error: "Unauthorized" };
  }

  const validatedFields = onboardingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { data: null, error: "Invalid fields" };
  }

  const { name, image } = validatedFields.data;

  try {
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        image,
      },
    });
  } catch (error) {
    return { data: null, error: "Failed to update user" };
  }

  return { data: "success", error: null };
};
