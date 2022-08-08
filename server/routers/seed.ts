import UserRoles from "supertokens-node/recipe/userroles";
import { createRouter } from "../createRouter";
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
      id: z.string().min(1),
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
      // Try to add role to provided user
      const { id } = input;
      const addRoleResponse = await UserRoles.addRoleToUser(id, "root");
      return {
        success: addRoleResponse.status === "OK",
        status: addRoleResponse.status,
      };
    },
  });
