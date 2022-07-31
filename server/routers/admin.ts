import { backendConfig } from "../../config/backendConfig";
import { createRouter } from "../createRouter";
import { TRPCError } from "@trpc/server";
import { usersRouter } from "./admin/users";
import { whitelistRouter } from "./admin/whitelist";
import { z } from "zod";
import supertokens, {
  getUserCount,
  getUsersNewestFirst,
} from "supertokens-node";

/**
 * Remember that whenever we want to use any functions from the supertokens-node lib,
 * we have to call the supertokens.init function at the top of that serverless function file.
 */
supertokens.init(backendConfig());

export const adminRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.accessTokenPayload?.admin) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return next();
  })
  .merge("users.", usersRouter)
  .merge("whitelist.", whitelistRouter);
