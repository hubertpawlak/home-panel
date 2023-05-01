// Licensed under the Open Software License version 3.0
import { udsRouter } from "./m2m/uds";
import { router } from "./trpc";

export const m2mRouter = router({
  uds: udsRouter,
});
