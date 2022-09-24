import dynamic from "next/dynamic";
import Head from "next/head";
import SuperTokensReact, { SuperTokensWrapper } from "supertokens-auth-react";
import { cacheableQueries } from "../types/CacheableQueries";
import {
  ComponentType,
  ReactElement,
  ReactNode,
  useEffect
  } from "react";
import { ContextModalProps, ModalsProvider } from "@mantine/modals";
import { frontendConfig } from "../config/frontendConfig";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { httpLink } from "@trpc/client/links/httpLink";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { splitLink } from "@trpc/client/links/splitLink";
import { withTRPC } from "@trpc/next";
import type { AppProps } from "next/app";
import type { AppRouter } from "../server/routers/_app";
import type { NextPage } from "next";

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
          <NotificationsProvider>
            <SuperTokensWrapper>
              {getLayout(<Component {...pageProps} />)}
            </SuperTokensWrapper>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
};

export default withTRPC<AppRouter>({
  config() {
    const url = process.env.NEXT_PUBLIC_APP_URL
      ? `https://${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";
    return {
      links: [
        // Disable request batching for cacheable queries
        splitLink({
          condition({ type, path }) {
            const isQuery = type === "query";
            const isCacheable = (cacheableQueries[path] ?? 0) > 0;
            return isQuery && isCacheable;
          },
          true: httpLink({ url }),
          false: httpBatchLink({ url }),
        }),
      ],
    };
  },
})(App);
