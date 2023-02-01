// Licensed under the Open Software License version 3.0
import { TRPCError } from "@trpc/server";
import { get as getValueAsync } from "@vercel/edge-config";
import { t } from "../routers/trpc";

interface EnforceConfigFlagOptions {
  flag: string;
  defaultFlagValue: boolean;
  passthrough?: boolean;
}

interface EnforceConfigFlagContext {
  isFlagEnabled?: boolean;
}

export const enforceConfigFlag = ({
  flag,
  defaultFlagValue,
  passthrough,
}: EnforceConfigFlagOptions) =>
  t.middleware(async ({ next }) => {
    const env = process.env.NODE_ENV ?? "development";
    // Get config flag
    const isFlagEnabled: boolean =
      (await getValueAsync(`${env}_${flag}`)) ?? defaultFlagValue;
    // Pass flag state if passthrough enabled
    if (!isFlagEnabled && passthrough)
      return next<EnforceConfigFlagContext>({
        ctx: { isFlagEnabled: true },
      });
    // Throw if feature is not enabled
    if (!isFlagEnabled)
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `This procedure is disabled by ${flag} flag`,
      });
    // Flag === true, proceed
    return next<EnforceConfigFlagContext>({ ctx: {} });
  });
