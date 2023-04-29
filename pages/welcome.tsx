// Licensed under the Open Software License version 3.0
import {
  Button,
  Code,
  Container,
  Group,
  Highlight,
  List,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import {
  IconAddressBook,
  IconBrandGithub,
  IconCode,
  IconEdit,
  IconHome,
  IconShield,
} from "@tabler/icons-react";
import Balancer from "react-wrap-balancer";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";

function ThemedListIcon({ Icon }: { Icon: Icon }) {
  return (
    <ThemeIcon size="lg" radius="xl" variant="gradient">
      <Icon />
    </ThemeIcon>
  );
}

const WelcomePage: NextPageWithLayout = () => {
  return (
    <Container size="xl">
      <WelcomeTitle />
      <WelcomeList />
      <WelcomeButtons />
      <WelcomeDisclaimer />
    </Container>
  );
};

WelcomePage.getLayout = (page) => (
  <Layout title="Strona główna" icon={<IconHome />}>
    {page}
  </Layout>
);

export default WelcomePage;

function WelcomeTitle() {
  return (
    <Title align="center">
      <Balancer>
        <Highlight highlight={["panel", "sterowania", "domem"]}>
          Nowoczesny panel do&nbsp;zdalnego sterowania domem
        </Highlight>
      </Balancer>
    </Title>
  );
}

function WelcomeList() {
  return (
    <List spacing="xs" mt="sm">
      <List.Item icon={<ThemedListIcon Icon={IconShield} />}>
        <Text>
          <b>Bezpieczny</b> - sprawdzone narzędzia czuwają nad poprawnością kodu
        </Text>
      </List.Item>
      <List.Item icon={<ThemedListIcon Icon={IconEdit} />}>
        <Text>
          <b>Elastyczny</b> - łatwo zarządzaj dostępem, dzięki przejrzystym
          panelom administracyjnym
        </Text>
      </List.Item>
      <List.Item icon={<ThemedListIcon Icon={IconCode} />}>
        <Text>
          <b>Darmowy</b> - kod źródłowy jest publicznie dostępny, każdy może
          uruchomić taki panel dla swojego domu
        </Text>
      </List.Item>
    </List>
  );
}

function WelcomeButtons() {
  return (
    <Group mt="sm" align="center" position="center">
      <Button
        component="a"
        href="https://hubertpawlak.dev"
        target="_blank"
        rel="noopener"
        radius="xl"
        variant="gradient"
        leftIcon={<IconAddressBook />}
      >
        O autorze
      </Button>
      <Button
        component="a"
        href="https://github.com/hubertpawlak/home-panel"
        target="_blank"
        rel="noopener"
        radius="xl"
        color="dark.9"
        variant="filled"
        leftIcon={<IconBrandGithub />}
      >
        Kod źródłowy
      </Button>
    </Group>
  );
}

function WelcomeDisclaimer() {
  const session = useSessionContext();
  const userId = !session.loading && session.userId;
  const { data: version } = trpc.health.version.useQuery(undefined, {
    staleTime: Infinity,
    enabled: !session.loading && !!session.userId,
  });

  return (
    <>
      <Text color="dimmed" mt="sm" align="center">
        <Balancer>
          Ta&nbsp;strona jest prywatną instancją panelu. Dostęp
          do&nbsp;sterowania wymaga zalogowania&nbsp;się na&nbsp;autoryzowane
          konto. Porozmawiaj z&nbsp;właścicielem domu, aby nadał&nbsp;Ci
          odpowiednie uprawnienia. Po&nbsp;otrzymaniu uprawnień przyciski
          nawigacyjne staną&nbsp;się aktywne.
        </Balancer>
      </Text>
      {userId ? (
        <Code block mt="sm">
          {JSON.stringify({ userId, version }, null, 2)}
        </Code>
      ) : null}
    </>
  );
}
