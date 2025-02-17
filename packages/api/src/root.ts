import { authRouter } from "./router/auth";
import { cacheRouter } from "./router/cache";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  cache: cacheRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
