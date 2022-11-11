// Licensed under the Open Software License version 3.0
import { generateKeyPair } from "jose";
import { getUserById } from "supertokens-node/recipe/thirdparty";
import UserRoles from "supertokens-node/recipe/userroles";
import webPush from "web-push";
import { z } from "zod";
import { JwtAlg } from "../../types/JwtAlg";
import { SharedMax } from "../../types/SharedMax";
import { jwtPrivateKeyToBase64, jwtPublicKeyToBase64 } from "../../utils/jwt";
import { disableOnProduction } from "../middleware/disableOnProduction";
import { publicProcedure, router } from "./trpc";

export const seedRouter = router({
  generateVapidKeys: publicProcedure
    .use(disableOnProduction)
    .query(async () => {
      const { publicKey, privateKey } = webPush.generateVAPIDKeys();
      return {
        publicKey,
        privateKey,
      };
    }),
  generateKeys: publicProcedure.use(disableOnProduction).query(async () => {
    if (process.env.NODE_ENV === "production") return {};
    const { publicKey, privateKey } = await generateKeyPair(JwtAlg);
    // Use helper functions to convert keys into an easy to store format
    return {
      publicKey: await jwtPublicKeyToBase64(publicKey),
      privateKey: await jwtPrivateKeyToBase64(privateKey),
    };
  }),
  createDefaultRoles: publicProcedure.mutation(async () => {
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
  }),
  addRootRole: publicProcedure
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
