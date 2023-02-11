// Licensed under the Open Software License version 3.0
import type { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";
import SessionReact from "supertokens-auth-react/recipe/session";
import ThirdPartyReact, {
  Github,
  Google,
} from "supertokens-auth-react/recipe/thirdparty";
import { appInfo } from "./appInfo";

export const frontendConfig: () => SuperTokensConfig = () => {
  return {
    appInfo,
    languageTranslations: {
      translations: {
        pl: {
          THIRD_PARTY_SIGN_IN_AND_UP_HEADER_TITLE: "Logowanie",
          THIRD_PARTY_SIGN_IN_UP_FOOTER_START: "Kontynuując, akceptujesz ",
          THIRD_PARTY_SIGN_IN_UP_FOOTER_TOS: "Zasady Korzystania z Serwisu",
          THIRD_PARTY_SIGN_IN_UP_FOOTER_AND: " i ",
          THIRD_PARTY_SIGN_IN_UP_FOOTER_PP: "Politykę Prywatności",
          THIRD_PARTY_SIGN_IN_UP_FOOTER_END: "",
          THIRD_PARTY_PROVIDER_DEFAULT_BTN_START: "Zaloguj się przy użyciu ",
          THIRD_PARTY_PROVIDER_DEFAULT_BTN_END: "",
          THIRD_PARTY_ERROR_NO_EMAIL:
            "Nie udało się uzyskać adresu email. Wypróbuj inną metodę.",
          BRANDING_POWERED_BY_START: "Powered by ",
          BRANDING_POWERED_BY_END: " ",
        },
      },
      defaultLanguage: "pl",
    },
    recipeList: [
      ThirdPartyReact.init({
        style: `
                [data-supertokens~=container] {
                    --palette-background: 10, 10, 10;
                    --palette-primary: 24, 100, 171;
                    --palette-success: 43, 138, 62;
                    --palette-textTitle: 219, 219, 219;
                    --palette-textLabel: 219, 219, 219;
                    --palette-textPrimary: 219, 219, 219;
                    --palette-error: 201, 42, 42;
                    --palette-errorBackground: 201, 42, 42;
                    --palette-textInput: 255, 255, 255;
                    --palette-textLink: 255, 255, 255;
                    --palette-superTokensBrandingBackground: 10, 10, 10;
                    --palette-superTokensBrandingText: 131, 131, 131;
                }
                [data-supertokens~="providerButton"] {
                  justify-content: center;
                  border: 0px !important;
                  cursor: pointer;
                }
                [data-supertokens~="providerButtonLeft"] {
                  margin-left: 0px;
                  margin-right: 4px;
                }
                [data-supertokens~="providerGitHub"] {
                  background-color: #222;
                  color: #fff;
                }
                [data-supertokens~="providerGitHub"]:hover {
                  background-color: #000 !important;
                }
                [data-supertokens~="providerGitHub"] > [data-supertokens~="providerButtonLeft"] {
                  filter: invert(100%);
                }
                [data-supertokens~="providerGoogle"] {
                  background-color: #4285f4;
                  color: #fff;
                }
                [data-supertokens~="providerGoogle"]:hover {
                  background-color: #073075 !important;
                }
                [data-supertokens~="providerGoogle"] [data-supertokens~="providerButtonLogoCenter"] {
                  background-color: #fff;
                  padding: 5px;
                }
                [data-supertokens~="providerButtonText"] {
                  font-weight: bold;
                }
            `,
        signInAndUpFeature: {
          providers: [Github.init(), Google.init()],
        },
      }),
      SessionReact.init(),
    ],
  };
};
