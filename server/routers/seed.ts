import UserRoles from "supertokens-node/recipe/userroles";
import { createRouter } from "../createRouter";
import { getUserById } from "supertokens-node/recipe/thirdparty";
import { SharedMax } from "../../types/SharedMax";
import { z } from "zod";

export const seedRouter = createRouter()
  .mutation("createDefaultRoles", {
    input: z.null().optional(),
    output: z.boolean(),
    async resolve({}) {
      // No permissions for now - keep checks simple
      // Nobody
      const nobodyResponse = await UserRoles.createNewRoleOrAddPermissions(
        "nobody",
        []
      );
      if (nobodyResponse.createdNewRole === false) return false;

      // User
      const userResponse = await UserRoles.createNewRoleOrAddPermissions(
        "user",
        []
      );
      if (userResponse.createdNewRole === false) return false;

      // Admin
      const adminResponse = await UserRoles.createNewRoleOrAddPermissions(
        "admin",
        []
      );
      if (adminResponse.createdNewRole === false) return false;

      // Root
      const rootResponse = await UserRoles.createNewRoleOrAddPermissions(
        "root",
        []
      );
      if (rootResponse.createdNewRole === false) return false;

      return true;
    },
  })
  .mutation("addRootRole", {
    input: z.object({
      id: z.string().min(1).max(SharedMax),
    }),
    output: z.object({
      success: z.boolean(),
      status: z.string(),
    }),
    async resolve({ input }) {
      const rootUsers = await UserRoles.getUsersThatHaveRole("root");
      // Unknown role
      if (rootUsers.status !== "OK") {
        return {
          success: false,
          status: rootUsers.status,
        };
      }
      // There may be users with root perms already
      if (rootUsers.users.length > 0)
        return {
          success: false,
          status: "ROOT_ACCOUNT_EXISTS",
        };
      const { id } = input;
      // Check if user exists
      const userWithProvidedId = await getUserById(id);
      if (!userWithProvidedId) {
        return {
          success: false,
          status: "INVALID_USER_ID",
        };
      }
      // Add role
      const addRoleResponse = await UserRoles.addRoleToUser(id, "root");
      return {
        success: addRoleResponse.status === "OK",
        status: addRoleResponse.status,
      };
    },
  });
