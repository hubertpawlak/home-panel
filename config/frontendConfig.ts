import ThirdPartyReact, {
  Github,
} from "supertokens-auth-react/recipe/thirdparty";
import SessionReact from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import type { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";

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
        palette: {
          background: "#0a0a0a",
          primary: "#1864ab",
          success: "#2b8a3e",
          error: "#c92a2a",
          textTitle: "#dbdbdb",
          textLabel: "#dbdbdb",
          textInput: "white",
          textPrimary: "#dbdbdb",
          textLink: "white",
          superTokensBrandingBackground: "#0a0a0a",
          superTokensBrandingText: "#838383",
        },
        signInAndUpFeature: {
          providers: [Github.init()],
        },
      }),
      SessionReact.init(),
    ],
  };
};
