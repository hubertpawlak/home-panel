import supabase from "../../utils/supabase";
import supertokens from "supertokens-node";
import UserRoles from "supertokens-node/recipe/userroles";
import { backendConfig } from "../../config/backendConfig";
import { createRouter } from "../createRouter";
import { definitions } from "../../types/supabase";
import { env } from "process";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

/**
 * Remember that whenever we want to use any functions from the supertokens-node lib,
 * we have to call the supertokens.init function at the top of that serverless function file.
 */
supertokens.init(backendConfig());

export const testRouter = createRouter()
  .middleware(async ({ next }) => {
    if (env.NODE_ENV !== "development") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return next();
  })
  .query("getInfNumbers", {
    input: z.object({
      cursor: z
        .string()
        .default("0")
        .transform((s) => Number(s)),
    }),
    resolve({ input }) {
      return {
        v: [input.cursor],
        nextCursor: input.cursor > 2 ? null : String(input.cursor + 1),
      };
    },
  })
  .query("userInfo", {
    input: z.undefined(),
    output: z.any().optional(),
    resolve({ ctx }) {
      return ctx;
    },
  })
  .query("getTemperatureSensors", {
    input: z.any(),
    async resolve({}) {
      return (
        await supabase
          .from<definitions["temperature_sensors"]>("temperature_sensors")
          .select("*")
      ).data;
    },
  })
  .query("getRoles", {
    input: z.any(),
    async resolve({}) {
      return {
        roles: await UserRoles.getAllRoles(),
      };
    },
  })
  .query("timestamp", {
    input: z.undefined(),
    output: z.number(),
    resolve({}) {
      return Date.now();
    },
  });
