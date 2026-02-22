import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return { status: "ok", timestamp: Date.now() };
  }),
  // Tambahkan router lain di sini
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
