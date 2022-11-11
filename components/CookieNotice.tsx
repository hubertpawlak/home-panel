// Licensed under the Open Software License version 3.0
import {
  Button,
  Group,
  Paper,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { Cookie } from "tabler-icons-react";

export function CookieNotice() {
  const [closedCookieNotice, setClosedCookieNotice] = useLocalStorage<boolean>({
    key: "closed-cookie-notice",
    defaultValue: false,
  });

  // Make it easier to click on larger screens (less mouse movement required)
  const theme = useMantineTheme();
  const smallScreen = useMediaQuery(
    `(max-width: ${theme.breakpoints.xs}px)`,
    false,
    { getInitialValueInEffect: false }
  );

  if (closedCookieNotice) return null;

  return (
    <Paper
      withBorder
      p="md"
      shadow="md"
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        margin: 10,
        maxWidth: smallScreen ? "100vw" : "50vw",
        zIndex: 999,
      }}
    >
      <Group spacing="xs">
        <ThemeIcon>
          <Cookie fontSize="inherit" />
        </ThemeIcon>
        <Text size="md" weight={500}>
          Informacja o ciasteczkach
        </Text>
      </Group>
      <Text color="dimmed" mt="xs">
        Ta strona wykorzystuje cookies, localStorage i sessionStorage do
        działania serwisu.
        <br />
        Więcej o nich znajdziesz{" "}
        <Link href="/privacy" passHref>
          <Text variant="link" component="a">
            tutaj
          </Text>
        </Link>
        .
      </Text>
      <Group position={smallScreen ? "right" : "left"} mt="xs">
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            setClosedCookieNotice(true);
          }}
        >
          Akceptuję
        </Button>
      </Group>
    </Paper>
  );
}
