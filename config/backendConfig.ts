import SessionNode from "supertokens-node/recipe/session";
import ThirdPartyNode from "supertokens-node/recipe/thirdparty";
import UserRoles from "supertokens-node/recipe/userroles";
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
      UserRoles.init(),
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
      SessionNode.init(),
    ],
    telemetry: false,
    isInServerlessEnv: true,
  };
};
