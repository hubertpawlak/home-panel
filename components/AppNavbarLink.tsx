// Licensed under the Open Software License version 3.0
import { NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import type { Icon as IconType } from "tabler-icons-react";
import { trpc } from "../utils/trpc";
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
  const { data: userPower } = trpc.self.getPower.useQuery(undefined, {
    placeholderData: 0,
    // Reduce the amount of queries
    staleTime: 60 * 1000, // 1 min
    // Don't ask the server for userPower if there is no user session
    enabled: doesSessionExist,
  });

  // Disable useless buttons
  const disabled =
    (!!requiredPower && !doesSessionExist) ||
    (!!requiredPower && requiredPower > (userPower ?? 0));

  return (
    <NavLink
      component={Link}
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
