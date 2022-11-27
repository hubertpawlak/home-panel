// Licensed under the Open Software License version 3.0
import { Logtail } from "@logtail/node";
import { z } from "zod";
import { SharedMax } from "../../types/SharedMax";
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
  reportTimeFormattingProblems: publicProcedure
    .use(
      enforceConfigFlag({
        flag: "logTimeFormattingProblems",
        defaultFlagValue: false,
        passthrough: true,
      })
    )
    .input(
      z.object({
        uiNow: z.number().or(z.nan()),
        updated_at: z.string().max(SharedMax).optional(),
        updatedToday: z.boolean().optional(),
        result: z.string().max(SharedMax).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.isFlagEnabled) return false;
      await logtail.warn("Frontend reported time formatting problem", {
        ...input,
      });
      return true;
    }),
});
