import { AppHeader } from "../components/AppHeader";
import { AppNavbar } from "../components/AppNavbar";
import { AppShell } from "@mantine/core";
import { PropsWithChildren, useEffect, useState } from "react";
import Head from "next/head";
import Session from "supertokens-auth-react/recipe/session";

const Layout = ({
  title,
  icon,
  children,
}: PropsWithChildren<{ title: string; icon: JSX.Element }>) => {
  const [navOpened, setNavOpened] = useState(false);
  const [doesSessionExist, setDoesSessionExist] = useState(false);

  useEffect(() => {
    Session.doesSessionExist().then((exists) => setDoesSessionExist(exists));
  }, []);

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
            {...{ navOpened, setNavOpened, icon, title, doesSessionExist }}
          />
        }
      >
        {children}
      </AppShell>
    </>
  );
};

export default Layout;
