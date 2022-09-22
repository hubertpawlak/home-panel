import { adminRouter } from "./admin";
import { createRouter } from "../createRouter";
import { m2mRouter } from "./m2m";
import { pushRouter } from "./push";
import { rootRouter } from "./root";
import { seedRouter } from "./seed";
import { selfServiceRouter } from "./self";
import { sensorsRouter } from "./sensors";
import { testRouter } from "./test";

export const appRouter = createRouter()
  .merge("test.", testRouter)
  .merge("seed.", seedRouter)
  .merge("m2m.", m2mRouter)
  .merge("sensors.", sensorsRouter)
  .merge("push.", pushRouter)
  .merge("self.", selfServiceRouter)
  .merge("root.", rootRouter)
  .merge("admin.", adminRouter);

export type AppRouter = typeof appRouter;
