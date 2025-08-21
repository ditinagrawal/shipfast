import { router } from "../trpc";
import { s3Router } from "./s3";

export const appRouter = router({
  s3: s3Router,
});

export type AppRouter = typeof appRouter;
