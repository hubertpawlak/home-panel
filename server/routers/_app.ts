import { createRouter } from "../createRouter";
import { adminRouter } from "./admin";
import { testRouter } from "./test";

export const appRouter = createRouter()
  .merge("test.", testRouter)
  .merge("admin.", adminRouter);

export type AppRouter = typeof appRouter;
