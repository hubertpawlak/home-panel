import supabase from "../../utils/supabase";
import { _createProtectedRouter } from "../createProtectedRouter";
import { createRouter } from "../createRouter";
import { SharedMax } from "../../types/SharedMax";
import { z } from "zod";
import type { definitions } from "../../types/supabase";

const subscriptionSchema = z.object({
  endpoint: z.string().min(1).max(SharedMax).startsWith("https://"),
  keys: z.object({
    p256dh: z.string().min(1).max(SharedMax),
    auth: z.string().min(1).max(SharedMax),
  }),
});

// Initial setup
const pushRouterRestricted = _createProtectedRouter({
  minRequiredRole: "user",
}).mutation("register", {
  input: subscriptionSchema,
  async resolve({ input, ctx }) {
    const { endpoint } = input;
    const { p256dh, auth } = input.keys;
    const { status } = await supabase
      .from<definitions["push"]>("push")
      .upsert(
        { endpoint, p256dh, auth, ownerId: ctx.user.id },
        { returning: "minimal" }
      );
    return { status };
  },
});

// Subscription changes/maintenance
const pushRouterPublic = createRouter().mutation("change", {
  input: z.object({
    oldSubscription: subscriptionSchema,
    newSubscription: subscriptionSchema.optional().nullable(),
  }),
  async resolve({ input }) {
    const { oldSubscription, newSubscription } = input;
    const {
      status: status1,
      data: oldData,
      count,
    } = await supabase
      .from<definitions["push"]>("push")
      .delete({ returning: "representation", count: "exact" })
      .match({
        endpoint: oldSubscription.endpoint,
        p256dh: oldSubscription.keys.p256dh,
        auth: oldSubscription.keys.auth,
      });
    // Require that the old sub is removed
    if (!newSubscription || !count) return { status: [status1, null] };
    const { status: status2 } = await supabase
      .from<definitions["push"]>("push")
      .upsert(
        {
          endpoint: newSubscription.endpoint,
          p256dh: newSubscription.keys.p256dh,
          auth: newSubscription.keys.auth,
          ownerId: oldData?.[0]?.ownerId,
        },
        { returning: "minimal" }
      );
    return { status: [status1, status2] };
  },
});

export const pushRouter = createRouter()
  .merge(pushRouterRestricted)
  .merge(pushRouterPublic);
