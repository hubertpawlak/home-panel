// Licensed under the Open Software License version 3.0
import { adminRouter } from "./admin";
import { m2mRouter } from "./m2m";
import { pushRouter } from "./push";
import { rootRouter } from "./root";
import { seedRouter } from "./seed";
import { selfServiceRouter } from "./self";
import { sensorsRouter } from "./sensors";
import { telemetryRouter } from "./telemetry";
import { router } from "./trpc";

export const appRouter = router({
  seed: seedRouter,
  m2m: m2mRouter,
  sensors: sensorsRouter,
  push: pushRouter,
  self: selfServiceRouter,
  root: rootRouter,
  admin: adminRouter,
  log: telemetryRouter,
});

export type AppRouter = typeof appRouter;
