import { z } from "zod";

export const onboardingSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name should be at least 3 characters" })
    .max(30, { message: "Name should be less than 30 characters" }),
  image: z.string().min(1, { message: "Image is required" }),
});

export type OnboardingSchemaType = z.infer<typeof onboardingSchema>;
