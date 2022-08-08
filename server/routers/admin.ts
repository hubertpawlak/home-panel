import supertokens from "supertokens-node";
import { backendConfig } from "../../config/backendConfig";
import { createRouter } from "../createRouter";
import { TRPCError } from "@trpc/server";
import { usersRouter } from "./admin/users";

/**
 * Remember that whenever we want to use any functions from the supertokens-node lib,
 * we have to call the supertokens.init function at the top of that serverless function file.
 */
supertokens.init(backendConfig());

export const adminRouter = createRouter().merge("users.", usersRouter);
