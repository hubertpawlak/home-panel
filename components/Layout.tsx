import Head from "next/head";
import { AppHeader } from "../components/AppHeader";
import { AppNavbar } from "../components/AppNavbar";
import { AppShell } from "@mantine/core";
import { CookieNotice } from "./CookieNotice";
import { PropsWithChildren, useCallback, useState } from "react";
import { RoleProtected } from "./RoleProtected";
import { useEventListener } from "@mantine/hooks";

type LayoutProps = PropsWithChildren<{
  title: string;
  icon: JSX.Element;
  requiredPower?: number;
}>;

const Layout = ({ title, icon, children, requiredPower }: LayoutProps) => {
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
          {requiredPower ? (
            <RoleProtected requiredPower={requiredPower}>
              {children}
            </RoleProtected>
          ) : (
            children
          )}
        </div>
      </AppShell>
    </>
  );
};

export default Layout;
