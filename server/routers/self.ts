import { _createProtectedRouter } from "../createProtectedRouter";
import { z } from "zod";

export const selfServiceRouter = _createProtectedRouter({
  minRequiredRole: "user",
}).query("getPower", {
  input: z.null().optional(),
  output: z.number().min(0),
  async resolve({ ctx }) {
    const userPower = ctx.user.power ?? 0;
    return userPower;
  },
});
