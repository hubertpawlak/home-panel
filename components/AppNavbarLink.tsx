import { Dispatch, SetStateAction } from "react";
import { Icon as IconType } from "tabler-icons-react";
import { NavLink, ThemeIcon } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
export interface IAppNavbarLink {
  href: string;
  Icon: IconType;
  title: string;
  requiredPower?: number;
}

interface AppNavbarLinkProps extends IAppNavbarLink {
  setNavOpened: Dispatch<SetStateAction<boolean>>;
}

export function AppNavbarLink({
  href,
  Icon,
  title,
  setNavOpened,
  requiredPower,
}: AppNavbarLinkProps) {
  const router = useRouter();
  const session = useSessionContext();
  const doesSessionExist = !session.loading && session.doesSessionExist;
  const userPowerQuery = trpc.useQuery(["self.getPower"], {
    placeholderData: 0,
    // Reduce the amount of queries
    staleTime: 60 * 1000, // 1 min
    // Don't ask the server for userPower if there is no user session
    enabled: doesSessionExist,
  });
  const userPower = userPowerQuery.data ?? 0;

  // Disable useless buttons
  const disabled =
    (!!requiredPower && !doesSessionExist) ||
    (!!requiredPower && requiredPower > userPower);

  return (
    <NavLink
      component={NextLink}
      disabled={disabled}
      href={href}
      label={title}
      active={router.pathname === href}
      variant="light"
      icon={<Icon />}
      onClick={() => setNavOpened(false)}
    />
  );
}
