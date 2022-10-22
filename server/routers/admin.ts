import { sensorsRouter } from "./admin/sensors";
import { sourcesRouter } from "./admin/sources";
import { router } from "./trpc";

export const adminRouter = router({
  sources: sourcesRouter,
  sensors: sensorsRouter,
});
