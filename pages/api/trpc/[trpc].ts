import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

export const appRouter = trpc.router().query("timestamp", {
  input: z.undefined(),
  output: z.number(),
  resolve({}) {
    return Math.round(Date.now() % 100000);
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
