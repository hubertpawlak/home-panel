import { Dispatch, SetStateAction } from "react";
import {
  Divider,
  Group,
  Navbar,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { Timeline } from "tabler-icons-react";

interface AppNavbarProps {
  navOpened: boolean;
  // setNavOpened: Dispatch<SetStateAction<boolean>>
}

export const AppNavbar = ({ navOpened }: AppNavbarProps) => (
  <Navbar
    p="md"
    hiddenBreakpoint="xl"
    hidden={!navOpened}
    width={{ xs: "100%", sm: 300 }}
  >
    <Navbar.Section grow component={ScrollArea} offsetScrollbars>
      <UnstyledButton>
        <Group>
          <ThemeIcon>
            <Timeline fontSize="inherit" />
          </ThemeIcon>
          <Text>Panel sterowania</Text>
        </Group>
      </UnstyledButton>
    </Navbar.Section>
    <Navbar.Section>
      <Divider
        labelPosition="center"
        label="Hubert Pawlak 💻 2022"
        labelProps={{
          component: "a",
          href: "https://hubertpawlak.dev",
          target: "_blank",
          variant: "link",
        }}
      />
    </Navbar.Section>
  </Navbar>
);

export default AppNavbar;
