import supabase from "../../utils/supabase";
import { createRouter } from "../createRouter";
import { definitions } from "../../types/supabase";
import { SharedMax } from "../../types/SharedMax";
import { z } from "zod";

export const publicSensorsRouter = createRouter().query("getTemperatures", {
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
    const { data } = await supabase
      .from<definitions["temperature_sensors"]>("temperature_sensors")
      .select("hwId,temperature,resolution,updated_at,name,updated_by")
      .order("hwId", { ascending: true });
    return data ?? [];
  },
});
