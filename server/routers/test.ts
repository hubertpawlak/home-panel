import supertokens from "supertokens-node";
import { backendConfig } from "../../config/backendConfig";
import { createRouter } from "../createRouter";
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
  .query("timestamp", {
    input: z.undefined(),
    output: z.number(),
    resolve({}) {
      return Date.now();
    },
  });
