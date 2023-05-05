// Licensed under the Open Software License version 3.0
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect } from "react";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";

const SuperTokensComponentNoSSR = dynamic<unknown>(
  new Promise((res) => res(() => getRoutingComponent([ThirdPartyPreBuiltUI]))),
  { ssr: false }
);

export default function Auth() {
  // If the user visits a page that is not handled by us (like /auth/random), then we redirect them
  useEffect(() => {
    if (canHandleRoute([ThirdPartyPreBuiltUI]) === false) {
      // Redirect to home page to avoid infinite redirects
      window.location.href = "/";
    }
  }, []);

  return (
    <>
      <Head>
        <title>Logowanie - Zdalne zarządzanie domem</title>
      </Head>
      <SuperTokensComponentNoSSR />
    </>
  );
}
