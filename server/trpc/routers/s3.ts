import { S3 } from "@/lib/aws";
import { env } from "@/lib/env";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const fileUploadSchema = z.object({
  filename: z.string().min(1, { message: "Filename is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

const fileDeleteSchema = z.object({
  key: z.string().min(1, { message: "Key is required" }),
});

export const s3Router = router({
  uploadFile: protectedProcedure
    .input(fileUploadSchema)
    .mutation(async ({ input }) => {
      try {
        const { filename, contentType, size } = input;
        const uniqueKey = `${uuidv4()}-${filename}`;

        const command = new PutObjectCommand({
          Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          ContentType: contentType,
          ContentLength: size,
          Key: uniqueKey,
        });

        const presignedUrl = await getSignedUrl(S3, command, {
          expiresIn: 300,
        });

        return {
          presignedUrl,
          key: uniqueKey,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to generate presigned URL");
      }
    }),

  deleteFile: protectedProcedure
    .input(fileDeleteSchema)
    .mutation(async ({ input }) => {
      try {
        const command = new DeleteObjectCommand({
          Bucket: env.NEXT_PUBLIC_AWS_BUCKET_NAME,
          Key: input.key,
        });

        await S3.send(command);

        return { message: "File deleted successfully" };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete file");
      }
    }),
});
