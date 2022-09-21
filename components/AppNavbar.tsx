import { AppNavbarLink, IAppNavbarLink } from "./AppNavbarLink";
import { Dispatch, SetStateAction } from "react";
import { Divider, Navbar, ScrollArea } from "@mantine/core";
import { rolePower } from "../types/RolePower";
import {
  Bell,
  DatabaseImport,
  Home,
  Timeline,
  Users,
} from "tabler-icons-react";

interface AppNavbarProps {
  navOpened: boolean;
  setNavOpened: Dispatch<SetStateAction<boolean>>;
}

const links: IAppNavbarLink[] = [
  { href: "/", Icon: Home, title: "Strona główna" },
  {
    href: "/panel",
    Icon: Timeline,
    title: "Panel sterowania",
    requiredPower: rolePower["user"],
  },
  {
    href: "/notifications",
    Icon: Bell,
    title: "Powiadomienia",
    requiredPower: rolePower["user"],
  },
  {
    href: "/sources",
    Icon: DatabaseImport,
    title: "Źródła danych",
    requiredPower: rolePower["admin"],
  },
  {
    href: "/admin/users",
    Icon: Users,
    title: "Użytkownicy",
    requiredPower: rolePower["root"],
  },
];

export const AppNavbar = ({ navOpened, setNavOpened }: AppNavbarProps) => {
  return (
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
          }}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default AppNavbar;
