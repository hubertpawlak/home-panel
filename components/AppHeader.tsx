import { Dispatch, SetStateAction } from "react";
import {
  ActionIcon,
  Breadcrumbs,
  Burger,
  Button,
  Header,
  MediaQuery,
  ScrollArea,
} from "@mantine/core";
import { Home, Login, QuestionMark, UserCircle } from "tabler-icons-react";

interface AppHeaderProps {
  navOpened: boolean;
  setNavOpened: Dispatch<SetStateAction<boolean>>;
  icon?: JSX.Element;
  title?: string;
  isLoggedIn?: boolean;
}

export const AppHeader = ({
  navOpened,
  setNavOpened,
  icon,
  title,
  isLoggedIn,
}: AppHeaderProps) => (
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
      <ActionIcon
        title={isLoggedIn ? "Akcje zalogowanego użytkownika" : "Zaloguj się"}
      >
        {isLoggedIn ? <UserCircle /> : <Login />}
      </ActionIcon>
    </div>
  </Header>
);
