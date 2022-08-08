import { adminRouter } from "./admin";
import { createRouter } from "../createRouter";
import { seedRouter } from "./seed";
import { testRouter } from "./test";

export const appRouter = createRouter()
  .merge("test.", testRouter)
  .merge("seed.", seedRouter)
  .merge("admin.", adminRouter);

export type AppRouter = typeof appRouter;
