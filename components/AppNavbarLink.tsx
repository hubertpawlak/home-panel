import { AccessTokenPayload } from "../types/AccessTokenPayload";
import { Dispatch, SetStateAction } from "react";
import {
  Group,
  Text,
  ThemeIcon,
  UnstyledButton
  } from "@mantine/core";
import { Icon as IconType } from "tabler-icons-react";
import { NextLink } from "@mantine/next";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
export interface IAppNavbarLink {
  href: string;
  Icon: IconType;
  title: string;
  userOnly?: boolean;
  adminOnly?: boolean;
}

interface AppNavbarLinkProps extends IAppNavbarLink {
  setNavOpened: Dispatch<SetStateAction<boolean>>;
}

export function AppNavbarLink({
  href,
  Icon,
  title,
  setNavOpened,
  userOnly,
  adminOnly,
}: AppNavbarLinkProps) {
  const session = useSessionContext();
  const { doesSessionExist } = session;
  const accessTokenPayload: AccessTokenPayload = session.accessTokenPayload;
  const { admin } = accessTokenPayload;

  // Don't render useless buttons
  if (userOnly && !doesSessionExist) return null;
  if (adminOnly && !admin) return null;

  return (
    <NextLink href={href}>
      <UnstyledButton
        p="xs"
        sx={(theme) => ({
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
        onClick={() => setNavOpened(false)}
      >
        <Group>
          <ThemeIcon>
            <Icon fontSize="inherit" />
          </ThemeIcon>
          <Text>{title}</Text>
        </Group>
      </UnstyledButton>
    </NextLink>
  );
}
