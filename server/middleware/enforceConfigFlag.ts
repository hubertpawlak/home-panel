// Licensed under the Open Software License version 3.0
import { TRPCError } from "@trpc/server";
import * as configCat from "configcat-js-ssr";
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
    const CONFIG_CAT_SDK_KEY = process.env.CONFIG_CAT_SDK_KEY;
    if (!CONFIG_CAT_SDK_KEY) throw new Error("Missing CONFIG_CAT_SDK_KEY");
    // Get config flag
    const configCatClient = configCat.createClient(CONFIG_CAT_SDK_KEY);
    const isFlagEnabled: boolean = await configCatClient.getValueAsync(
      flag,
      defaultFlagValue
    );
    configCatClient.dispose();
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
