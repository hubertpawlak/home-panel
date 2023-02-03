// Licensed under the Open Software License version 3.0
import { generateKeyPair } from "jose";
import { getUserById } from "supertokens-node/recipe/thirdparty";
import UserRoles from "supertokens-node/recipe/userroles";
import webPush from "web-push";
import { z } from "zod";
import { JwtAlg } from "../../types/JwtAlg";
import { SharedMax } from "../../types/SharedMax";
import { jwtPrivateKeyToBase64, jwtPublicKeyToBase64 } from "../../utils/jwt";
import { enforceConfigFlag } from "../middleware/enforceConfigFlag";
import { publicProcedure, router } from "./trpc";

export const seedRouter = router({
  generateVapidKeys: publicProcedure
    .use(
      enforceConfigFlag({
        flag: "seedRouter_generateVapidKeys",
        defaultFlagValue: false,
      })
    )
    .query(async () => {
      const { publicKey, privateKey } = webPush.generateVAPIDKeys();
      return {
        publicKey,
        privateKey,
      };
    }),
  generateKeys: publicProcedure
    .use(
      enforceConfigFlag({
        flag: "seedRouter_generateKeys",
        defaultFlagValue: false,
      })
    )
    .query(async () => {
      const { publicKey, privateKey } = await generateKeyPair(JwtAlg);
      // Use helper functions to convert keys into an easy to store format
      return {
        publicKey: await jwtPublicKeyToBase64(publicKey),
        privateKey: await jwtPrivateKeyToBase64(privateKey),
      };
    }),
  createDefaultRoles: publicProcedure
    .use(
      enforceConfigFlag({
        flag: "seedRouter_createDefaultRoles",
        defaultFlagValue: false,
      })
    )
    .mutation(async () => {
      // No permissions for now - keep checks simple
      const nobodyResponse = await UserRoles.createNewRoleOrAddPermissions(
        "nobody",
        []
      );
      const userResponse = await UserRoles.createNewRoleOrAddPermissions(
        "user",
        []
      );
      const adminResponse = await UserRoles.createNewRoleOrAddPermissions(
        "admin",
        []
      );
      if (adminResponse.createdNewRole === false) return false;
      const rootResponse = await UserRoles.createNewRoleOrAddPermissions(
        "root",
        []
      );
      // Get all existing roles
      const roles = (await UserRoles.getAllRoles()).roles;
      return {
        roles,
        created: {
          nobody: nobodyResponse.createdNewRole,
          user: userResponse.createdNewRole,
          admin: adminResponse.createdNewRole,
          root: rootResponse.createdNewRole,
        },
      };
    }),
  addRootRole: publicProcedure
    .use(
      enforceConfigFlag({
        flag: "seedRouter_addRootRole",
        defaultFlagValue: false,
      })
    )
    .input(
      z.object({
        id: z.string().min(1).max(SharedMax),
      })
    )
    .mutation(async ({ input }) => {
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
    }),
  getMyId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    if (!ctx.user.id) return null;
    return ctx.user.id;
  }),
});
