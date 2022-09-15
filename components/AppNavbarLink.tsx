import { Dispatch, SetStateAction } from "react";
import {
  Group,
  Text,
  ThemeIcon,
  UnstyledButton
  } from "@mantine/core";
import { Icon as IconType } from "tabler-icons-react";
import { NextLink } from "@mantine/next";
import { trpc } from "../utils/trpc";
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
  const session = useSessionContext();
  const doesSessionExist = !session.loading && session.doesSessionExist;
  const userPowerQuery = trpc.useQuery(["self.getPower"], {
    placeholderData: 0,
    // Don't ask the server for userPower if there is no user session
    enabled: doesSessionExist,
  });
  const userPower = userPowerQuery.data!;

  // Don't render useless buttons
  if (requiredPower && !doesSessionExist) return null;
  if ((requiredPower ?? 0) > userPower) return null;

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
