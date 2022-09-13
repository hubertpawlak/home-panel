import supabase from "../../../utils/supabase";
import { createM2MRouter } from "../../createM2MRouter";
import { definitions } from "../../../types/supabase";
import { SharedMax } from "../../../types/SharedMax";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const temperatureRouter = createM2MRouter().mutation(
  "storeTemperature",
  {
    input: z.object({
      hwId: z.string().min(1).max(SharedMax),
      temperature: z.number(),
      resolution: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { sourceId } = ctx;
      const { hwId, resolution, temperature } = input;
      const { data, error, status, statusText } = await supabase
        .from<definitions["temperature_sensors"]>("temperature_sensors")
        .upsert({
          hwId,
          temperature,
          resolution,
          // updated_at is set by "handle_updated_at" DB trigger
          updated_by: sourceId,
        });
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${status}: ${statusText}`,
        });
      return {
        data,
      };
    },
  }
);
