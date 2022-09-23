import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import {
  BrandGithub,
  Code as CodeIcon,
  Home,
  Icon,
  Edit,
  Shield,
  AddressBook,
} from "tabler-icons-react";
import {
  Button,
  Group,
  Highlight,
  List,
  ThemeIcon,
  Text,
  Title,
  Container,
  Code,
} from "@mantine/core";

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
  <Layout title="Strona główna" icon={<Home />}>
    {page}
  </Layout>
);

export default WelcomePage;

function WelcomeTitle() {
  return (
    <Title align="center">
      <Highlight highlight={["panel", "sterowania", "domem"]}>
        Nowoczesny panel do zdalnego sterowania domem
      </Highlight>
    </Title>
  );
}

function WelcomeList() {
  return (
    <List spacing="xs" mt="sm">
      <List.Item icon={<ThemedListIcon Icon={Shield} />}>
        <Text>
          <b>Bezpieczny</b> - sprawdzone narzędzia czuwają nad poprawnością kodu
        </Text>
      </List.Item>
      <List.Item icon={<ThemedListIcon Icon={Edit} />}>
        <Text>
          <b>Elastyczny</b> - łatwo zarządzaj dostępem, dzięki przejrzystym
          panelom administracyjnym
        </Text>
      </List.Item>
      <List.Item icon={<ThemedListIcon Icon={CodeIcon} />}>
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
        leftIcon={<AddressBook />}
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
        leftIcon={<BrandGithub />}
      >
        Kod źródłowy
      </Button>
    </Group>
  );
}

function WelcomeDisclaimer() {
  const session = useSessionContext();
  const userId = !session.loading && session.userId;

  return (
    <>
      <Text color="dimmed" mt="sm" align="justify">
        Ta strona jest prywatną instancją panelu. Dostęp do sterowania wymaga
        zalogowania się na autoryzowane konto. Porozmawiaj z&nbsp;właścicielem
        domu, aby nadał Ci odpowiednie uprawnienia. Po otrzymaniu uprawnień
        przyciski nawigacyjne staną się aktywne.
      </Text>
      {userId ? (
        <Code block mt="sm">
          &quot;userId&quot;: &quot;{userId}&quot;
        </Code>
      ) : null}
    </>
  );
}
