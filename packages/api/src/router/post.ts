import type { TRPCRouterRecord } from "@trpc/server";
import { desc, eq } from "@jv-recipes/db";
import { CreatePostSchema, Post } from "@jv-recipes/db/schema";
import { z } from "zod";

import { redis } from "../redis";
import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  createCache: protectedProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await redis.set(input.key, input.value);

      return redis.get(input.key);
    }),
  computeCache: protectedProcedure
    .input(z.object({ key: z.string(), value: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await redis.compute(input.key, () => {
        const temp = ["a"];
        const x = temp.fill("a", 0, input.value);
        return x.join("");
      });
    }),
  getCache: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      return await redis.get(input.key);
    }),
} satisfies TRPCRouterRecord;
