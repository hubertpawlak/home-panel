import UserRoles from "supertokens-node/recipe/userroles";
import { createRouter } from "./createRouter";
import { TRPCError } from "@trpc/server";
import { UserRole } from "../types/UserRole";

interface ProtectedRouterChecks {
  minRequiredRole?: UserRole;
}

type UserRolePower = {
  [key in UserRole]: number;
};

const rolePower: UserRolePower = {
  user: 1,
  admin: 2,
  root: Infinity,
};

export function createProtectedRouter({
  minRequiredRole,
}: ProtectedRouterChecks) {
  return createRouter().middleware(async ({ ctx, next }) => {
    if (ctx.bypassProtection)
      return next({
        ctx: {
          ...ctx,
          user: {
            id: "fakeRoot",
            roles: ["root"],
            power: rolePower["root"],
          },
        },
      });
    // Extract values
    const user = ctx.user;
    const userId = user?.id;
    // Deny guest access
    if (!(user && userId)) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    // Skip power check if no minimum is provided
    if (!minRequiredRole)
      return next({ ctx: { ...ctx, user: { id: userId } } });
    // Get roles and compare power
    const requiredPower = rolePower[minRequiredRole];
    const userRoles = (await UserRoles.getRolesForUser(userId)).roles;
    const userPower = userRoles.reduce((prevPower, role) => {
      const curRolePower = role in rolePower ? rolePower[role as UserRole] : 0;
      return Math.max(prevPower, curRolePower);
    }, 0);
    if (userPower < requiredPower)
      throw new TRPCError({ code: "UNAUTHORIZED" });
    // Check passed successfully
    return next({
      ctx: {
        ...ctx,
        user: {
          id: userId,
          roles: userRoles,
          power: userPower,
        },
      },
    });
  });
}
