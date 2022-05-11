import Head from "next/head";
import { AppHeader } from "../components/AppHeader";
import { AppNavbar } from "../components/AppNavbar";
import { AppShell } from "@mantine/core";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
  } from "react";
import { useEventListener } from "@mantine/hooks";

const Layout = ({
  title,
  icon,
  children,
}: PropsWithChildren<{ title: string; icon: JSX.Element }>) => {
  const [navOpened, setNavOpened] = useState(false);

  // Close navbar if user hovers over content
  const closeCallback = useCallback(() => setNavOpened(false), []);
  const childrenRef = useEventListener("mouseenter", closeCallback);

  return (
    <>
      <Head>
        <title>
          {`${title} - Zdalne zarządzanie domem` || "Zdalne zarządzanie domem"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
