// Licensed under the Open Software License version 3.0
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect } from "react";
import SuperTokens, { redirectToAuth } from "supertokens-auth-react";

const SuperTokensComponentNoSSR = dynamic(
  new Promise((res) => res(SuperTokens.getRoutingComponent)) as any,
  { ssr: false }
);

export default function Auth() {
  // If the user visits a page that is not handled by us (like /auth/random), then we redirect them back to the auth page.
  useEffect(() => {
    if (SuperTokens.canHandleRoute() === false) {
      redirectToAuth();
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
