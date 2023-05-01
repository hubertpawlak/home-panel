// Licensed under the Open Software License version 3.0
import { sourcesRouter } from "./admin/sources";
import { udsRouter } from "./admin/uds";
import { router } from "./trpc";

export const adminRouter = router({
  sources: sourcesRouter,
  uds: udsRouter,
});
