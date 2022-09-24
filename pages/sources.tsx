import Layout from "../components/Layout";
import { DatabaseImport } from "tabler-icons-react";
import { openContextModal } from "@mantine/modals";
import { rolePower } from "../types/RolePower";
import { SensorsTable } from "../components/SensorsTable";
import { trpc } from "../utils/trpc";
import { useForm } from "@mantine/form";
import { useMutationStatusNotification } from "../utils/notifications";
import type { NextPageWithLayout } from "./_app";
import {
  Button,
  Container,
  Grid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

const SourcesPage: NextPageWithLayout = () => {
  const signTokenForm = useForm({ initialValues: { sourceId: "" } });
  const signOpts = useMutationStatusNotification({
    successMessage: "Token został wygenerowany",
  });
  const { mutateAsync: signToken, isLoading: isSigningToken } =
    trpc.useMutation("admin.sources.signToken", {
      ...signOpts,
      onSuccess(data) {
        openContextModal({
          modal: "showToken",
          title: "Wygenerowano token",
          innerProps: { token: data },
        });
        signOpts.onSuccess?.(null, null, null);
      },
    });
  const { data: sensors } = trpc.useQuery([
    "admin.sensors.getTemperatureSensors",
  ]);

  return (
    <Container size="xl">
      <Stack spacing="xs">
        {/* Source token signing form */}
        <Title align="center">Dodaj źródło</Title>
        <form onSubmit={signTokenForm.onSubmit((values) => signToken(values))}>
          <Grid align="flex-end">
            <Grid.Col span="auto">
              <TextInput
                label="Nazwa źródła"
                placeholder="Garaż"
                {...signTokenForm.getInputProps("sourceId")}
              />
            </Grid.Col>
            <Grid.Col span="content">
              <Button type="submit" disabled={isSigningToken}>
                Utwórz token
              </Button>
            </Grid.Col>
          </Grid>
        </form>
        <Text color="dimmed" align="justify">
          Utworzone tokeny są&nbsp;ważne bezterminowo i&nbsp;nie można ich
          pojedynczo unieważnić. Obecnie wymagałoby to zmiany kluczy używanych
          przez serwer, a&nbsp;więc unieważnienia wszystkich źródeł. Tokeny
          zawierają podpisane cyfrowo informacje o&nbsp;źródle danych, takie jak
          nazwa. Każde źródło powinno mieć swój token.
        </Text>
        {/* List of all known temperature sensors */}
        <Title align="center">Czujniki temperatury</Title>
        <SensorsTable sensors={sensors} />
      </Stack>
    </Container>
  );
};

SourcesPage.getLayout = (page) => (
  <Layout
    title="Źródła danych"
    icon={<DatabaseImport />}
    requiredPower={rolePower["admin"]}
  >
    {page}
  </Layout>
);

export default SourcesPage;
