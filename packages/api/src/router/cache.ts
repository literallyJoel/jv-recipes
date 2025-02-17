import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { redis } from "../redis";
import { protectedProcedure } from "../trpc";

function relativeToSeconds(relative: string) {
  const value = parseInt(relative);

  if (isNaN(value)) {
    throw new Error(`Invalid cache time provided (numeric: recieved ${value})`);
  }

  if (value < 0) {
    throw new Error(`Invalide cache time provided (numeric: recieved ${value}`);
  }

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
      throw new Error(`Invalid cache time provided (unit: got ${unit})`);
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

      try {
        if (expires) {
          await redis.setex(key, expires, input.value);
          return redis.get(key);
        }

        return await redis.set(key, input.value, "GET");
      } catch (e) {
        console.error(`Cache Error: ${e as Error}`);
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  compute: protectedProcedure
    .input(
      z.object({ key: z.string(), value: z.string(), expires: zodExpires }),
    )
    .mutation(async ({ ctx, input }) => {
      const key = `${ctx.session.user.id}_${input.key}`;

      try {
        return await redis.compute(
          key,
          () => {
            return input.value;
          },
          input.expires,
        );
      } catch (e) {
        console.error(`Cache Error: ${e as Error}`);
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  get: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ ctx, input }) => {
      const key = `${ctx.session.user.id}_${input.key}`;
      try {
        return await redis.get(key);
      } catch (e) {
        console.error(`Cache Error: ${e as Error}`);
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
} satisfies TRPCRouterRecord;
