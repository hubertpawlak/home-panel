import { z } from "zod";
import { SharedMax } from "../../types/SharedMax";
import supabase from "../../utils/supabase";
import { userProcedure } from "../middleware/enforceUserAuth";
import { publicProcedure, router } from "./trpc";

const subscriptionSchema = z.object({
  endpoint: z.string().max(SharedMax).url().startsWith("https://"),
  keys: z.object({
    p256dh: z.string().min(1).max(SharedMax),
    auth: z.string().min(1).max(SharedMax),
  }),
});

export const pushRouter = router({
  // Initial setup
  register: userProcedure
    .input(subscriptionSchema)
    .mutation(async ({ input, ctx }) => {
      const { endpoint } = input;
      const { p256dh, auth } = input.keys;
      const { status } = await supabase
        .from("push")
        .upsert({ endpoint, p256dh, auth, ownerId: ctx.user.id });
      return { status };
    }),
  // Subscription changes/maintenance
  change: publicProcedure
    .input(
      z.object({
        oldSubscription: subscriptionSchema,
        newSubscription: subscriptionSchema.optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { oldSubscription, newSubscription } = input;
      const {
        status: status1,
        data: oldData,
        count,
      } = await supabase
        .from("push")
        .delete({ count: "exact" })
        .match({
          endpoint: oldSubscription.endpoint,
          p256dh: oldSubscription.keys.p256dh,
          auth: oldSubscription.keys.auth,
        })
        .select();
      // Require that the old sub is removed
      if (!newSubscription || !count) return { status: [status1, null] };
      const { status: status2 } = await supabase.from("push").upsert({
        endpoint: newSubscription.endpoint,
        p256dh: newSubscription.keys.p256dh,
        auth: newSubscription.keys.auth,
        ownerId: oldData?.[0]?.ownerId,
      });
      return { status: [status1, status2] };
    }),
});
