import { AppHeader } from "../components/AppHeader";
import { AppNavbar } from "../components/AppNavbar";
import { AppShell } from "@mantine/core";
import { PropsWithChildren, useState } from "react";
import Head from "next/head";

const Layout = ({
  title,
  icon,
  children,
}: PropsWithChildren<{ title: string; icon: JSX.Element }>) => {
  const [navOpened, setNavOpened] = useState(false);
  // const session = useSession({ suspense: false });
  // const isLoggedIn = session && !session.isLoading && session.userId;
  const isLoggedIn = false;
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
        navbar={<AppNavbar {...{ navOpened }} />}
        header={<AppHeader {...{ navOpened, setNavOpened, icon, title }} />}
      >
        {children}
      </AppShell>
    </>
  );
};

export default Layout;
