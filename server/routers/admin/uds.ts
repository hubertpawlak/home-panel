// Licensed under the Open Software License version 3.0
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SharedMax } from "../../../types/SharedMax";
import supabase from "../../../utils/supabase";
import { adminProcedure } from "../../middleware/enforceUserAuth";
import { router } from "../trpc";

export const udsRouter = router({
  // Sensors
  getSensors: adminProcedure.query(async () => {
    const { data } = await supabase
      .from("uds_sensors")
      .select("id,name,updated_by")
      .order("id", { ascending: true });
    return data;
  }),
  renameSensor: adminProcedure
    .input(
      z.object({
        id: z.string().min(1).max(SharedMax),
        name: z.string().trim().min(1).max(SharedMax),
      })
    )
    .mutation(async ({ input }) => {
      const { id, name } = input;
      const { error, status, statusText } = await supabase
        .from("uds_sensors")
        .update({ name })
        .eq("id", id)
        .neq("name", name);
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${status}: ${statusText}`,
        });
      return { success: true };
    }),
  deleteSensor: adminProcedure
    .input(
      z.object({
        id: z.string().min(1).max(SharedMax),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      const { error, status, statusText } = await supabase
        .from("uds_sensors")
        .delete()
        .match({ id });
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${status}: ${statusText}`,
        });
      return { success: true };
    }),
  // UPSes
  getUpses: adminProcedure.query(async () => {
    const { data } = await supabase
      .from("uds_upses")
      .select("id,name,updated_by")
      .order("id", { ascending: true });
    return data;
  }),
  renameUps: adminProcedure
    .input(
      z.object({
        id: z.string().min(1).max(SharedMax),
        name: z.string().trim().min(1).max(SharedMax),
      })
    )
    .mutation(async ({ input }) => {
      const { id, name } = input;
      const { error, status, statusText } = await supabase
        .from("uds_upses")
        .update({ name })
        .eq("id", id)
        .neq("name", name);
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${status}: ${statusText}`,
        });
      return { success: true };
    }),
  deleteUps: adminProcedure
    .input(
      z.object({
        id: z.string().min(1).max(SharedMax),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      const { error, status, statusText } = await supabase
        .from("uds_upses")
        .delete()
        .match({ id });
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${status}: ${statusText}`,
        });
      return { success: true };
    }),
});
