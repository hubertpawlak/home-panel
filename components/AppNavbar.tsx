import { AppNavbarLink, IAppNavbarLink } from "./AppNavbarLink";
import { Dispatch, SetStateAction } from "react";
import { Divider, Navbar, ScrollArea } from "@mantine/core";
import { rolePower } from "../types/RolePower";
import { ThirdPartyAuthNoSSR } from "./ThirdPartyAuthNoSSR";
import {
  Cookie,
  DatabaseImport,
  SectionSign,
  Timeline,
  Users,
} from "tabler-icons-react";

interface AppNavbarProps {
  navOpened: boolean;
  setNavOpened: Dispatch<SetStateAction<boolean>>;
}

const links: IAppNavbarLink[] = [
  { href: "/", Icon: Timeline, title: "Panel Sterowania" },
  // TODO: create tokens for sensors
  {
    href: "/sources",
    Icon: DatabaseImport,
    title: "Źródła danych",
    requiredPower: rolePower["admin"],
  },
  // TODO: Table; search, delete
  {
    href: "/admin/users",
    Icon: Users,
    title: "Użytkownicy",
    requiredPower: rolePower["admin"],
  },
  // TODO: as is
  { href: "/tos", Icon: SectionSign, title: "Warunki Korzystania" },
  // TODO: cookie notice
  { href: "/privacy", Icon: Cookie, title: "Polityka Prywatności" },
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
        <ThirdPartyAuthNoSSR requireAuth={false} key="AppNavbarLinks">
          {links.map((props) => (
            <AppNavbarLink
              {...props}
              key={props.title}
              setNavOpened={setNavOpened}
            />
          ))}
        </ThirdPartyAuthNoSSR>
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
