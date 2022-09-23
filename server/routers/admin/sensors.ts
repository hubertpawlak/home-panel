import supabase from "../../../utils/supabase";
import { createProtectedRouter } from "../../createProtectedRouter";
import { SharedMax } from "../../../types/SharedMax";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { definitions } from "../../../types/supabase";

export const sensorsRouter = createProtectedRouter()
  .mutation("renameTemperatureSensor", {
    input: z.object({
      hwId: z.string().min(1).max(SharedMax),
      name: z.string().min(1).max(SharedMax),
    }),
    async resolve({ input }) {
      const { hwId, name } = input;
      const { data, error, status, statusText } = await supabase
        .from<definitions["temperature_sensors"]>("temperature_sensors")
        .update({ hwId, name });
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${status}: ${statusText}`,
        });
      return { data };
    },
  })
  .mutation("deleteTemperatureSensor", {
    input: z.object({
      hwId: z.string().min(1).max(SharedMax),
    }),
    async resolve({ input }) {
      const { hwId } = input;
      const { error, status, statusText } = await supabase
        .from<definitions["temperature_sensors"]>("temperature_sensors")
        .delete()
        .match({ hwId });
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${status}: ${statusText}`,
        });
      return { success: true };
    },
  });
