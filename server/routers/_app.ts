// Licensed under the Open Software License version 3.0
import { adminRouter } from "./admin";
import { edgeConfigRouter } from "./edgeConfig";
import { appHealthRouter } from "./health";
import { m2mRouter } from "./m2m";
import { pushRouter } from "./push";
import { rootRouter } from "./root";
import { seedRouter } from "./seed";
import { selfServiceRouter } from "./self";
import { router } from "./trpc";
import { udsRouter } from "./uds";

export const appRouter = router({
  seed: seedRouter,
  m2m: m2mRouter,
  push: pushRouter,
  self: selfServiceRouter,
  root: rootRouter,
  admin: adminRouter,
  edgeConfig: edgeConfigRouter,
  health: appHealthRouter,
  uds: udsRouter,
});

export type AppRouter = typeof appRouter;
