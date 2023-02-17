// Licensed under the Open Software License version 3.0
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SharedMax } from "../../../types/SharedMax";
import supabase from "../../../utils/supabase";
import { adminProcedure } from "../../middleware/enforceUserAuth";
import { router } from "../trpc";

export const sensorsRouter = router({
  getTemperatureSensors: adminProcedure.query(async () => {
    const { data } = await supabase
      .from("temperature_sensors")
      .select("hwId,name,updated_by")
      .order("hwId", { ascending: true });
    return data;
  }),
  renameTemperatureSensor: adminProcedure
    .input(
      z.object({
        hwId: z.string().min(1).max(SharedMax),
        name: z.string().min(1).max(SharedMax),
      })
    )
    .mutation(async ({ input }) => {
      const { hwId, name } = input;
      const { error, status, statusText } = await supabase
        .from("temperature_sensors")
        .update({ name })
        .eq("hwId", hwId);
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${status}: ${statusText}`,
        });
      return { success: true };
    }),
  deleteTemperatureSensor: adminProcedure
    .input(
      z.object({
        hwId: z.string().min(1).max(SharedMax),
      })
    )
    .mutation(async ({ input }) => {
      const { hwId } = input;
      const { error, status, statusText } = await supabase
        .from("temperature_sensors")
        .delete()
        .match({ hwId });
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${status}: ${statusText}`,
        });
      return { success: true };
    }),
});
