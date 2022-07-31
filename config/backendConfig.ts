import SessionNode from "supertokens-node/recipe/session";
import ThirdPartyNode from "supertokens-node/recipe/thirdparty";
import { AccessTokenPayload } from "../types/AccessTokenPayload";
import { appInfo } from "./appInfo";
import { env } from "process";
import { prisma } from "../prisma/client";
import { Role } from "@prisma/client";
import { TypeInput } from "supertokens-node/types";

const notOnWhitelist =
  "Nie jesteś na białej liście lub masz zbyt niskie uprawnienia";

export const backendConfig = (): TypeInput => {
  if (
    !env.SUPERTOKENS_CONN_URI ||
    !env.SUPERTOKENS_API_KEY ||
    !env.GITHUB_CLIENT_ID ||
    !env.GITHUB_CLIENT_SECRET
  ) {
    throw "Configure SUPERTOKENS in your env file";
  }
  return {
    framework: "express",
    supertokens: {
      connectionURI: env.SUPERTOKENS_CONN_URI,
      apiKey: env.SUPERTOKENS_API_KEY,
    },
    appInfo,
    recipeList: [
      ThirdPartyNode.init({
        signInAndUpFeature: {
          providers: [
            ThirdPartyNode.Github({
              clientId: env.GITHUB_CLIENT_ID,
              clientSecret: env.GITHUB_CLIENT_SECRET,
            }),
          ],
        },
      }),
      SessionNode.init({
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              refreshSession: async function (input) {
                return originalImplementation.refreshSession(input);
              },
              createNewSession: async function (input) {
                // Prepare payload
                const { userId } = input;
                // TODO: whitelist check (wait for supertokens update)
                // TODO: call db to check role
                const isAdmin =
                  env.NODE_ENV === "development" &&
                  userId === "a95812ad-ca41-4987-93e9-7208d23bd25b";
                const injectedPayload: AccessTokenPayload = {
                  admin: isAdmin, // FIXME: Obsolete
                  role: isAdmin ? Role.ADMIN : Role.USER,
                };
                input.accessTokenPayload = {
                  ...input.accessTokenPayload,
                  ...injectedPayload,
                };
                // Continue with the standard
                return originalImplementation.createNewSession(input);
              },
            };
          },
        },
      }),
    ],
    telemetry: false,
    isInServerlessEnv: true,
  };
};
