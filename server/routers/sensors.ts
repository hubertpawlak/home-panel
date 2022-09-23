import supabase from "../../utils/supabase";
import { _createProtectedRouter } from "../createProtectedRouter";
import { SharedMax } from "../../types/SharedMax";
import { sub } from "date-fns";
import { z } from "zod";
import type { definitions } from "../../types/supabase";

export const sensorsRouter = _createProtectedRouter({
  minRequiredRole: "user",
}).query("getTemperatures", {
  input: z.null().optional(),
  output: z
    .array(
      z.object({
        hwId: z.string().min(1).max(SharedMax),
        temperature: z.number().nullable().optional(),
        resolution: z.number().nullable().optional(),
        updated_at: z.string().min(1).max(SharedMax),
        name: z.string().max(SharedMax).nullable().optional(),
        updated_by: z.string().min(1).max(SharedMax).nullable().optional(),
      })
    )
    .nullable(),
  async resolve() {
    // Don't send old readings
    const twoHoursAgo = sub(new Date(), { hours: 2 });
    const { data } = await supabase
      .from<definitions["temperature_sensors"]>("temperature_sensors")
      .select("hwId,temperature,resolution,updated_at,name,updated_by")
      .gte("updated_at", twoHoursAgo.toISOString())
      .order("hwId", { ascending: true });
    return data ?? [];
  },
});
