import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { redis } from "../redis";
import { protectedProcedure } from "../trpc";

export const postRouter = {
  createCache: protectedProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      await redis.set(input.key, input.value);

      return redis.get(input.key);
    }),
  computeCache: protectedProcedure
    .input(z.object({ key: z.string(), value: z.number() }))
    .mutation(async ({ input }) => {
      return await redis.compute(input.key, async () => {
        return Array(input.value).fill("a").join("");
      });
    }),
  getCache: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return await redis.get(input.key);
    }),
} satisfies TRPCRouterRecord;
