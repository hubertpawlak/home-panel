import supertokens from "supertokens-node";
import { _createProtectedRouter } from "../createProtectedRouter";
import { backendConfig } from "../../config/backendConfig";
import { sensorsRouter } from "./admin/sensors";
import { sourcesRouter } from "./admin/sources";
import { usersRouter } from "./admin/users";

/**
 * Remember that whenever we want to use any functions from the supertokens-node lib,
 * we have to call the supertokens.init function at the top of that serverless function file.
 */
supertokens.init(backendConfig());

export const adminRouter = _createProtectedRouter({
  minRequiredRole: "admin",
})
  .merge("users.", usersRouter)
  .merge("sources.", sourcesRouter)
  .merge("sensors.", sensorsRouter);
