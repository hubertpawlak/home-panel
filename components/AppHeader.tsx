// Licensed under the Open Software License version 3.0
import {
  Breadcrumbs,
  Burger,
  Button,
  Header,
  MediaQuery,
  ScrollArea,
} from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import { Home, QuestionMark } from "tabler-icons-react";
import { AppHeaderSignInBtn } from "./AppHeaderSignInBtn";

interface AppHeaderProps {
  navOpened: boolean;
  setNavOpened: Dispatch<SetStateAction<boolean>>;
  icon?: JSX.Element;
  title?: string;
}

export const AppHeader = ({
  navOpened,
  setNavOpened,
  icon,
  title,
}: AppHeaderProps) => {
  return (
    <Header height={40} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="xl" styles={{ display: "none" }}>
          <Burger
            opened={navOpened}
            aria-label={
              navOpened ? "zamknij menu nawigacyjne" : "otwórz menu nawigacyjne"
            }
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
        <AppHeaderSignInBtn />
      </div>
    </Header>
  );
};
