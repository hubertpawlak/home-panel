import UserRoles from "supertokens-node/recipe/userroles";
import { Context } from "./context";
import { createRouter } from "./createRouter";
import { router, TRPCError } from "@trpc/server";
import { UserRole } from "../types/UserRole";

interface ProtectedRouterOptions {
  minRequiredRole?: UserRole;
}

interface ProtectedRouterContext {
  user: {
    id: string;
    roles?: string[];
    power?: number;
  };
}

type UserRolePower = {
  [key in UserRole]: number;
};

const rolePower: UserRolePower = {
  user: 1,
  admin: 2,
  root: Infinity,
};

/**
 * Create a router guarding access by requiring a certain role (or higher)
 */
export function _createProtectedRouter({
  minRequiredRole,
}: ProtectedRouterOptions) {
  return createRouter().middleware(async ({ ctx, next }) => {
    if (ctx.bypassProtection)
      return next<ProtectedRouterContext>({
        ctx: {
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
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    // Skip power check if no minimum is provided
    if (!minRequiredRole)
      return next<ProtectedRouterContext>({
        ctx: {
          user: {
            id: userId,
          },
        },
      });
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
    return next<ProtectedRouterContext>({
      ctx: {
        user: {
          id: userId,
          roles: userRoles,
          power: userPower,
        },
      },
    });
  });
}

/**
 * Create a fake router with ProtectedRouterContext.
 * Used for context swapping for nested routers.
 * @example
 * const real = _createProtectedRouter();
 * const fake = createProtectedRouter();
 * real.merge(fake);
 */
export function createProtectedRouter() {
  return router<ProtectedRouterContext>();
}
