// Licensed under the Open Software License version 3.0
import { MantineProvider } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import type { ComponentType, ReactElement, ReactNode } from "react";
import { useEffect } from "react";
import { Provider as WrapBalancerProvider } from "react-wrap-balancer";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import { frontendConfig } from "../config/frontendConfig";
import { trpc } from "../utils/trpc";

export type NextPageWithLayout = NextPage & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

if (typeof window !== "undefined") {
  // We only want to call this init function on the frontend
  SuperTokensReact.init(frontendConfig());
}

// Used "any" because "next/dynamic" returns weird type but actually works fine
const modals: Record<string, any> = {
  editUser: dynamic(() => import("../components/EditUserModal")),
  editSensor: dynamic(() => import("../components/EditSensorModal")),
  editUps: dynamic(() => import("../components/EditUpsModal")),
  showToken: dynamic(() => import("../components/ShowTokenModal")),
} as Record<string, ComponentType<ContextModalProps<any>>>;

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  // Try to register serviceWorker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        async (reg) => {
          // Update sub in DB
          const sub = await reg.pushManager.getSubscription();
          if (!sub) return;
          const json = sub.toJSON();
          if (!json) return;
          const { endpoint, keys } = json;
          if (!endpoint || !keys) return;
          fetch("/api/trpc/push.register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              endpoint,
              keys: { p256dh: keys.p256dh, auth: keys.auth },
            }),
          })
            .then(() => {})
            .catch(() => {});
        },
        (err) => {
          console.error("SW: registration failed: ", err);
        }
      );
    }
  }, []);

  return (
    <>
      <Head>
        <title>Zdalne zarządzanie domem</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Aplikacja do zdalnego monitorowania i zarządzania domem"
        />
      </Head>

      <WrapBalancerProvider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
            defaultGradient: { deg: 45, from: "cyan", to: "indigo" },
            components: {
              ThemeIcon: {
                defaultProps: {
                  gradient: { deg: 45, from: "cyan", to: "indigo" },
                },
              },
              Mark: {
                styles: (theme) => ({
                  root: {
                    backgroundImage: theme.fn.linearGradient(
                      45,
                      theme.colors.cyan[5],
                      theme.colors.indigo[5]
                    ),
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                }),
              },
            },
          }}
        >
          <ModalsProvider modals={modals}>
            <Notifications />
            <SuperTokensWrapper>
              {getLayout(<Component {...pageProps} />)}
            </SuperTokensWrapper>
          </ModalsProvider>
        </MantineProvider>
      </WrapBalancerProvider>
    </>
  );
};

export default trpc.withTRPC(App);
