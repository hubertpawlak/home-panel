import { TRPCError } from "@trpc/server";
import UserRoles from "supertokens-node/recipe/userroles";
import { rolePower } from "../../types/RolePower";
import type { UserRole } from "../../types/UserRole";
import { publicProcedure, t } from "../routers/trpc";

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

export const enforceUserAuth = ({ minRequiredRole }: ProtectedRouterOptions) =>
  t.middleware(async ({ ctx, next }) => {
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
    if (userPower < requiredPower) throw new TRPCError({ code: "FORBIDDEN" });
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

export const userProcedure = publicProcedure.use(
  enforceUserAuth({ minRequiredRole: "user" })
);

export const adminProcedure = publicProcedure.use(
  enforceUserAuth({ minRequiredRole: "admin" })
);

export const rootProcedure = publicProcedure.use(
  enforceUserAuth({ minRequiredRole: "root" })
);
