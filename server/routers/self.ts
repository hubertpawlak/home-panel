// Licensed under the Open Software License version 3.0
import { userProcedure } from "../middleware/enforceUserAuth";
import { router } from "./trpc";

export const selfServiceRouter = router({
  getPower: userProcedure.query(async ({ ctx }) => {
    const userPower = ctx.user.power ?? 0;
    return userPower;
  }),
});
