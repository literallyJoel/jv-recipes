import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { redis } from "../redis";
import { protectedProcedure } from "../trpc";

function relativeToSeconds(relative: string) {
  const value = parseInt(relative);
  const unit = relative.slice(String(value).length);

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    case "w":
      return value * 60 * 60 * 24 * 7;
    default:
      return 0;
  }
}

//Validates the relative time format and auto converts
const zodExpires = z
  .string()
  .regex(/^[0-9]+(s|m|h|d|w)$/, "Invalid relative time format")
  .transform((expires) => relativeToSeconds(expires))
  .optional();

export const cacheRouter = {
  set: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        expires: zodExpires,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const key = `${ctx.session.user.id}_${input.key}`;
      const expires = input.expires;

      if (expires) {
        await redis.setex(key, expires, input.value);
        return redis.get(key);
      }

      return await redis.set(key, input.value, "GET");
    }),
  compute: protectedProcedure
    .input(
      z.object({ key: z.string(), value: z.string(), expires: zodExpires }),
    )
    .mutation(async ({ ctx, input }) => {
      const key = `${ctx.session.user.id}_${input.key}`;

      return await redis.compute(
        key,
        () => {
          return input.value;
        },
        input.expires,
      );
    }),
  get: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      const key = `${ctx.session.user.id}_${input.key}`;

      return await redis.get(key);
    }),
} satisfies TRPCRouterRecord;
