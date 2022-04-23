import { Dispatch, SetStateAction } from "react";
import { Divider, Navbar, ScrollArea } from "@mantine/core";
import { AppNavbarLink, IAppNavbarLink } from "./AppNavbarLink";
import { Timeline } from "tabler-icons-react";

interface AppNavbarProps {
  navOpened: boolean;
  setNavOpened: Dispatch<SetStateAction<boolean>>;
}

const links: IAppNavbarLink[] = [
  { href: "/", Icon: Timeline, title: "Panel Sterowania" },
];

export const AppNavbar = ({ navOpened, setNavOpened }: AppNavbarProps) => (
  <Navbar
    p="md"
    hiddenBreakpoint="xl"
    hidden={!navOpened}
    width={{ xs: "100%", sm: 300 }}
  >
    <Navbar.Section grow component={ScrollArea} offsetScrollbars>
      {links.map((props) => (
        <AppNavbarLink
          {...props}
          key={props.title}
          setNavOpened={setNavOpened}
        />
      ))}
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
