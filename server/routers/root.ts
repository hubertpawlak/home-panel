import supertokens from "supertokens-node";
import { _createProtectedRouter } from "../createProtectedRouter";
import { backendConfig } from "../../config/backendConfig";
import { usersRouter } from "./root/users";

/**
 * Remember that whenever we want to use any functions from the supertokens-node lib,
 * we have to call the supertokens.init function at the top of that serverless function file.
 */
supertokens.init(backendConfig());

export const rootRouter = _createProtectedRouter({
  minRequiredRole: "root",
}).merge("users.", usersRouter);
