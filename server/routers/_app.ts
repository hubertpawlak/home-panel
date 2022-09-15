import { adminRouter } from "./admin";
import { createRouter } from "../createRouter";
import { m2mRouter } from "./m2m";
import { seedRouter } from "./seed";
import { selfServiceRouter } from "./self";
import { testRouter } from "./test";

export const appRouter = createRouter()
  .merge("test.", testRouter)
  .merge("seed.", seedRouter)
  .merge("m2m.", m2mRouter)
  .merge("self.", selfServiceRouter)
  .merge("admin.", adminRouter);

export type AppRouter = typeof appRouter;
