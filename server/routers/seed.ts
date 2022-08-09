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
      // Nobody
      const nobodyPerms: string[] = [];
      const nobodyResponse = await UserRoles.createNewRoleOrAddPermissions(
        "nobody",
        nobodyPerms
      );
      if (nobodyResponse.createdNewRole === false) return false;

      // User
      const userPerms = [...nobodyPerms, "whitelisted"];
      const userResponse = await UserRoles.createNewRoleOrAddPermissions(
        "user",
        userPerms
      );
      if (userResponse.createdNewRole === false) return false;

      // Root
      const rootPerms = [...userPerms, "*"];
      const rootResponse = await UserRoles.createNewRoleOrAddPermissions(
        "root",
        rootPerms
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
