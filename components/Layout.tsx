import Head from "next/head";
import { AppHeader } from "../components/AppHeader";
import { AppNavbar } from "../components/AppNavbar";
import { AppShell } from "@mantine/core";
import { CookieNotice } from "./CookieNotice";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
  } from "react";
import { trpc } from "../utils/trpc";
import { useEventListener } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

type LayoutProps = PropsWithChildren<{
  title: string;
  icon: JSX.Element;
  requiredPower?: number;
}>;

const Layout = ({ title, icon, children, requiredPower }: LayoutProps) => {
  const router = useRouter();
  const [navOpened, setNavOpened] = useState(false);

  // Close navbar if user hovers over content
  const closeCallback = useCallback(() => setNavOpened(false), []);
  const childrenRef = useEventListener("mouseenter", closeCallback);

  // Centralized way to handle protected pages
  const session = useSessionContext();
  const userPowerQuery = trpc.useQuery(["self.getPower"], {
    // Reduce the amount of queries
    staleTime: 60 * 1000, // 1 min
    // Don't ask the server for userPower if there is no user session
    enabled: !session.loading && session.doesSessionExist,
  });
  const { isFetched } = userPowerQuery;
  const userPower = userPowerQuery.data ?? 0;
  const notEnoughPower = userPower < (requiredPower ?? 0);

  // Assume that user has enough power and switch to homepage if not
  useEffect(() => {
    // Nothing to check
    if (requiredPower === undefined) return;
    if (session.loading) return;
    // No user
    if (!session.doesSessionExist) router.replace("/");
    // User without enough power
    if (isFetched && notEnoughPower) router.replace("/");
  }, [requiredPower, session, router, isFetched, notEnoughPower]);

  return (
    <>
      <Head>
        <title>
          {`${title} - Zdalne zarządzanie domem` || "Zdalne zarządzanie domem"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CookieNotice />
      <AppShell
        fixed
        navbarOffsetBreakpoint="xl"
        navbar={<AppNavbar {...{ navOpened, setNavOpened }} />}
        header={
          <AppHeader
            {...{
              navOpened,
              setNavOpened,
              icon,
              title,
            }}
          />
        }
      >
        <div
          ref={childrenRef}
          style={{
            minHeight: "100%",
          }}
        >
          {children}
        </div>
      </AppShell>
    </>
  );
};

export default Layout;
