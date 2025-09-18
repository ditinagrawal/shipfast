"use client";

import type { AppRouter } from "@/server/trpc/routers/_app";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
