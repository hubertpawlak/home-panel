// Licensed under the Open Software License version 3.0
import { Divider, Navbar, ScrollArea } from "@mantine/core";
import {
  IconBell,
  IconDatabaseImport,
  IconHeart,
  IconHome,
  IconServerCog,
  IconTimeline,
  IconUsers,
} from "@tabler/icons-react";
import type { Dispatch, SetStateAction } from "react";
import { rolePower } from "../types/RolePower";
import type { IAppNavbarLink } from "./AppNavbarLink";
import { AppNavbarLink } from "./AppNavbarLink";

interface AppNavbarProps {
  navOpened: boolean;
  setNavOpened: Dispatch<SetStateAction<boolean>>;
}

const links: IAppNavbarLink[] = [
  { href: "/", Icon: IconHome, title: "Strona główna" },
  {
    href: "/panel",
    Icon: IconTimeline,
    title: "Panel sterowania",
    requiredPower: rolePower["user"],
  },
  {
    href: "/notifications",
    Icon: IconBell,
    title: "Powiadomienia",
    requiredPower: rolePower["user"],
  },
  {
    href: "/sources",
    Icon: IconDatabaseImport,
    title: "Źródła danych",
    requiredPower: rolePower["admin"],
  },
  {
    href: "/admin/users",
    Icon: IconUsers,
    title: "Użytkownicy",
    requiredPower: rolePower["root"],
  },
  {
    href: "/admin/config",
    Icon: IconServerCog,
    title: "Zaawansowane",
    requiredPower: rolePower["admin"],
  },
  {
    href: "/thanks",
    Icon: IconHeart,
    title: "Podziękowania",
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
          label="Hubert Pawlak 💻 2022 - 2023"
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
