// Licensed under the Open Software License version 3.0
import { Logtail } from "@logtail/node";
import { z } from "zod";
import { enforceConfigFlag } from "../middleware/enforceConfigFlag";
import { publicProcedure, router } from "./trpc";

const LOGTAIL_SOURCE_TOKEN = process.env.LOGTAIL_SOURCE_TOKEN;
if (!LOGTAIL_SOURCE_TOKEN) throw new Error("Missing LOGTAIL_SOURCE_TOKEN");
const logtail = new Logtail(LOGTAIL_SOURCE_TOKEN);

export const telemetryRouter = router({
  reportLatePush: publicProcedure
    .use(
      enforceConfigFlag({
        flag: "logLatePushNotifications",
        defaultFlagValue: false,
        passthrough: true,
      })
    )
    .input(
      z.object({
        now: z.number().nonnegative(), // current timestamp client-side
        timestamp: z.number().nonnegative(), // timestamp when push was sent
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.isFlagEnabled) return false;
      const { now, timestamp } = input;
      const diff = now - timestamp;
      await logtail.warn("Service worker reported late push", {
        now,
        timestamp,
        diff,
      });
      return true;
    }),
});
