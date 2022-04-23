import { TRPCError } from "@trpc/server";
import { env } from "process";
import { z } from "zod";
import { createRouter } from "../createRouter";
import supertokens from "supertokens-node";
import { backendConfig } from "../../config/backendConfig";

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
  .query("userInfo", {
    input: z.undefined(),
    output: z
      .object({
        id: z.string().optional(),
      })
      .optional(),
    resolve({ ctx }) {
      return ctx.user;
    },
  })
  .query("timestamp", {
    input: z.undefined(),
    output: z.number(),
    resolve({}) {
      return Date.now();
    },
  });
