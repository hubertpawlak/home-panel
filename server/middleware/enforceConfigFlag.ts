// Licensed under the Open Software License version 3.0
import { TRPCError } from "@trpc/server";
import { redis } from "../../utils/redis";
import { t } from "../routers/trpc";

interface EnforceConfigFlagOptions {
  flag: string;
  defaultFlagValue: boolean;
}

export const enforceConfigFlag = ({
  flag,
  defaultFlagValue,
}: EnforceConfigFlagOptions) =>
  t.middleware(async ({ next }) => {
    // Get config flag
    const isFlagEnabled: boolean =
      (await redis.hget("flags", flag)) ?? defaultFlagValue;
    // Throw if feature is not enabled
    if (isFlagEnabled !== true)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This procedure is disabled by ${flag} flag`,
      });
    // Flag === true, proceed
    return next({ ctx: {} });
  });
