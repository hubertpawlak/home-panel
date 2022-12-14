// Licensed under the Open Software License version 3.0
import { z } from "zod";
import {
  HARDCODED_PUSH_NOTIFY_ABOVE,
  HARDCODED_PUSH_TTL,
} from "../../../types/Push";
import { SharedMax } from "../../../types/SharedMax";
import { sendPush } from "../../../utils/push";
import { redis } from "../../../utils/redis";
import supabase from "../../../utils/supabase";
import { m2mProcedure } from "../../middleware/enforceM2MAuth";
import { router } from "../trpc";

const deleteSubscription = (endpoint: string) => {
  return async () =>
    await supabase.from("push").delete().eq("endpoint", endpoint);
};

export const temperatureRouter = router({
  storeTemperatures: m2mProcedure
    .input(
      z
        .array(
          z.object({
            hwId: z.string().min(1).max(SharedMax),
            temperature: z.number(),
            resolution: z.number(),
          })
        )
        .min(1)
    )
    .mutation(async ({ ctx, input }) => {
      // Phase 1 - database
      const { sourceId } = ctx;
      // Add sourceId to every reading
      type InputWithSource = typeof input[0] & { updated_by: string };
      const _input: InputWithSource[] = input.map((i) => ({
        ...i,
        updated_by: sourceId,
      }));
      const { count: tempsCount } = await supabase
        .from("temperature_sensors")
        // updated_at is set by "handle_updated_at" DB trigger
        .upsert(_input, {
          count: "exact",
        });
      // Phase 2 - web push
      const triggerPush = input.some(
        ({ temperature }) => temperature > HARDCODED_PUSH_NOTIFY_ABOVE
      );
      if (!triggerPush) return { tempsCount };
      // Prevent notification spam
      // Get previous value and bump in one request
      const pushAlreadySent = await redis.set<boolean>("notified", true, {
        ex: 60, // TTL in seconds
        get: true, // Get previous value or null
      });
      if (pushAlreadySent === true) return { tempsCount };
      // Get subscriptions and send notifications
      const { data: subscriptions, count: pushCount } = await supabase
        .from("push")
        .select("endpoint,p256dh,auth", { count: "exact" });
      const timestamp = Date.now();
      await Promise.all(
        (subscriptions ?? [])?.map((sub) =>
          sendPush(
            sub,
            {
              title: `Temperatura przekroczy??a ${HARDCODED_PUSH_NOTIFY_ABOVE}??C `,
              body: `Jeden z czujnik??w zg??osi?? temperatur?? powy??ej limitu`,
              timestamp,
            },
            {
              TTL: HARDCODED_PUSH_TTL,
              headers: {
                Urgency: "high",
              },
            }
          ).catch(deleteSubscription(sub.endpoint))
        )
      );
      return {
        tempsCount,
        pushCount,
      };
    }),
});
