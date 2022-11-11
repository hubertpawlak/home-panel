// Licensed under the Open Software License version 3.0
import { env } from "process";
import SessionNode from "supertokens-node/recipe/session";
import ThirdPartyNode from "supertokens-node/recipe/thirdparty";
import UserRoles from "supertokens-node/recipe/userroles";
import type { TypeInput } from "supertokens-node/types";
import { appInfo } from "./appInfo";

export const backendConfig = (): TypeInput => {
  if (
    !env.SUPERTOKENS_CONN_URI ||
    !env.SUPERTOKENS_API_KEY ||
    !env.GITHUB_CLIENT_ID ||
    !env.GITHUB_CLIENT_SECRET ||
    !env.GOOGLE_CLIENT_ID ||
    !env.GOOGLE_CLIENT_SECRET
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
            ThirdPartyNode.Google({
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            }),
          ],
        },
      }),
      SessionNode.init(),
      UserRoles.init(),
    ],
    telemetry: false,
    isInServerlessEnv: true,
  };
};
