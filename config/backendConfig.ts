import ThirdPartyNode from "supertokens-node/recipe/thirdparty";
import SessionNode from "supertokens-node/recipe/session";
import { appInfo } from "./appInfo";
import { TypeInput } from "supertokens-node/types";
import { env } from "process";

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
      SessionNode.init(),
    ],
    telemetry: false,
    isInServerlessEnv: true,
  };
};
