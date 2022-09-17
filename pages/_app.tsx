import Head from "next/head";
import SuperTokensReact from "supertokens-auth-react";
import { AppProps } from "next/app";
import { AppRouter } from "../server/routers/_app";
import { cacheableQueries } from "../types/CacheableQueries";
import { frontendConfig } from "../config/frontendConfig";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { httpLink } from "@trpc/client/links/httpLink";
import { MantineProvider } from "@mantine/core";
import { NextPage } from "next";
import { NotificationsProvider } from "@mantine/notifications";
import { ReactElement, ReactNode } from "react";
import { splitLink } from "@trpc/client/links/splitLink";
import { withTRPC } from "@trpc/next";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

if (typeof window !== "undefined") {
  // We only want to call this init function on the frontend
  SuperTokensReact.init(frontendConfig());
}

const muiTheme = createTheme({ palette: { mode: "dark" } });

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
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
        }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <NotificationsProvider>
            {getLayout(<Component {...pageProps} />)}
          </NotificationsProvider>
        </MuiThemeProvider>
      </MantineProvider>
    </>
  );
};

export default withTRPC<AppRouter>({
  config() {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
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
