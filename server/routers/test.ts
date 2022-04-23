import { TRPCError } from "@trpc/server";
import { env } from "process";
import { z } from "zod";
import { createRouter } from "../createRouter";

export const testRouter = createRouter()
  .middleware(async ({ next }) => {
    if (env.NODE_ENV !== "development") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return next();
  })
  .query("timestamp", {
    input: z.undefined(),
    output: z.number(),
    resolve({}) {
      return Date.now();
    },
  });
