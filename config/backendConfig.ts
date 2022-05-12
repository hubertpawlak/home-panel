import SessionNode from "supertokens-node/recipe/session";
import ThirdPartyNode from "supertokens-node/recipe/thirdparty";
import { AccessTokenPayload } from "../types/AccessTokenPayload";
import { appInfo } from "./appInfo";
import { env } from "process";
import { TypeInput } from "supertokens-node/types";

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
              createNewSession: async function (input) {
                // Prepare payload
                const { userId } = input;
                // TODO: call db to check if admin
                const injectedPayload: AccessTokenPayload = {
                  admin:
                    env.NODE_ENV === "development" &&
                    userId === "ff317e72-1b01-4994-b9b5-41cf01427c86",
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
