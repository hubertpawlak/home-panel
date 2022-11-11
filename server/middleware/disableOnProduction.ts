// Licensed under the Open Software License version 3.0
import { TRPCError } from "@trpc/server";
import { t } from "../routers/trpc";

export const disableOnProduction = t.middleware(async ({ next }) => {
  if (process.env.NODE_ENV === "production")
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This procedure is not available in this environment",
    });
  return next();
});
