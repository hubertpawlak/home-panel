// Licensed under the Open Software License version 3.0
import { version } from "../../package.json";
import { userProcedure } from "../middleware/enforceUserAuth";
import { router } from "./trpc";

export const appHealthRouter = router({
  version: userProcedure.query(async () => version),
});
