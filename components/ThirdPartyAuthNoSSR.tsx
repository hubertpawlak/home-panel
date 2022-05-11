import dynamic from "next/dynamic";
import ThirdParty from "supertokens-auth-react/recipe/thirdparty";

export const ThirdPartyAuthNoSSR = dynamic(
  new Promise<typeof ThirdParty.ThirdPartyAuth>((res) =>
    res(ThirdParty.ThirdPartyAuth)
  ),
  { ssr: false }
);
