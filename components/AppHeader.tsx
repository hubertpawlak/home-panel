import { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import {
  ActionIcon,
  Breadcrumbs,
  Burger,
  Button,
  Header,
  MediaQuery,
  Menu,
  ScrollArea,
} from "@mantine/core";
import {
  Home,
  Login,
  Logout,
  QuestionMark,
  UserCircle,
} from "tabler-icons-react";
import {
  redirectToAuth,
  signOut,
} from "supertokens-auth-react/recipe/thirdparty";

interface AppHeaderProps {
  navOpened: boolean;
  setNavOpened: Dispatch<SetStateAction<boolean>>;
  icon?: JSX.Element;
  title?: string;
  doesSessionExist?: boolean;
  setDoesSessionExist: Dispatch<SetStateAction<boolean>>;
}

export const AppHeader = ({
  navOpened,
  setNavOpened,
  icon,
  title,
  doesSessionExist,
  setDoesSessionExist,
}: AppHeaderProps) => {
  const [userLoading, setUserLoading] = useState(false);
  const { invalidateQueries } = trpc.useContext();
  const router = useRouter();

  return (
    <Header height={40} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="xl" styles={{ display: "none" }}>
          <Burger
            opened={navOpened}
            onClick={() => setNavOpened((o) => !o)}
            size="sm"
            mr="xs"
          />
        </MediaQuery>
        <ScrollArea offsetScrollbars scrollbarSize={2} sx={{ flexGrow: 1 }}>
          <Breadcrumbs sx={{ alignItems: "center" }}>
            <Button variant="subtle" compact color="dark" leftIcon={<Home />}>
              Dom
            </Button>
            <Button
              variant="subtle"
              compact
              color="dark"
              leftIcon={icon ?? <QuestionMark />}
            >
              {title ?? "Bez tytułu"}
            </Button>
          </Breadcrumbs>
        </ScrollArea>
        {doesSessionExist ? (
          <Menu
            control={
              <ActionIcon
                title="Akcje zalogowanego użytkownika"
                loading={userLoading}
              >
                <UserCircle />
              </ActionIcon>
            }
          >
            <Menu.Item
              icon={<Logout />}
              disabled={userLoading}
              onClick={async () => {
                setUserLoading(true);
                signOut()
                  .then(() => {
                    setDoesSessionExist(false); // Restore sign in button
                    invalidateQueries(); // Make tRPC forget possibly secret content
                    router.push("/"); // Redirect to homepage
                  })
                  .finally(() => {
                    setUserLoading(false);
                  });
              }}
            >
              Wyloguj się
            </Menu.Item>
          </Menu>
        ) : (
          <ActionIcon
            title="Zaloguj się"
            loading={userLoading}
            onClick={() => {
              setUserLoading(true);
              redirectToAuth({ redirectBack: true });
            }}
          >
            <Login />
          </ActionIcon>
        )}
      </div>
    </Header>
  );
};
