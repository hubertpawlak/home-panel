import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { Icon as IconType, Timeline } from "tabler-icons-react";
import { NextLink } from "@mantine/next";
import { Dispatch, SetStateAction } from "react";

export interface IAppNavbarLink {
  href: string;
  Icon: IconType;
  title: string;
}

interface AppNavbarLinkProps extends IAppNavbarLink {
  setNavOpened: Dispatch<SetStateAction<boolean>>;
}

export function AppNavbarLink({
  href,
  Icon,
  title,
  setNavOpened,
}: AppNavbarLinkProps) {
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
