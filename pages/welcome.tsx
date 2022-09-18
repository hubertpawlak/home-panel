import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import { ThirdPartyAuthNoSSR } from "../components/ThirdPartyAuthNoSSR";
import { trpc } from "../utils/trpc";
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
  MantineGradient,
  Code,
} from "@mantine/core";

const sharedGradient: MantineGradient = {
  deg: 45,
  from: "cyan",
  to: "indigo",
};

function ThemedListIcon({ Icon }: { Icon: Icon }) {
  return (
    <ThemeIcon
      size="lg"
      radius="xl"
      variant="gradient"
      gradient={sharedGradient}
    >
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
      <ThirdPartyAuthNoSSR requireAuth={false} key="WelcomePage">
        <WelcomeDisclaimer />
      </ThirdPartyAuthNoSSR>
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
      <Highlight
        highlight={["panel", "sterowania", "domem"]}
        highlightStyles={(theme) => ({
          backgroundImage: theme.fn.linearGradient(
            45,
            theme.colors.cyan[5],
            theme.colors.indigo[5]
          ),
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        })}
      >
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
        gradient={sharedGradient}
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
  const doesSessionExist = !session.loading && session.doesSessionExist;

  const userId = !session.loading && session.userId;

  const userPowerQuery = trpc.useQuery(["self.getPower"], {
    placeholderData: 0,
    // Reduce the amount of queries
    staleTime: 60 * 1000, // 1 min
    // Don't ask the server for userPower if there is no user session
    enabled: doesSessionExist,
  });
  const userPower = userPowerQuery.data ?? 0;

  // Hide disclaimer if user is authorized to do anything
  if (userPower > 0) return null;

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
