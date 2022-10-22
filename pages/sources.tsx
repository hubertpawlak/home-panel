import {
  Button,
  Container,
  Grid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { openContextModal } from "@mantine/modals";
import { DatabaseImport } from "tabler-icons-react";
import Layout from "../components/Layout";
import { SensorsTable } from "../components/SensorsTable";
import { rolePower } from "../types/RolePower";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";

const SourcesPage: NextPageWithLayout = () => {
  const signTokenForm = useForm({ initialValues: { sourceId: "" } });
  const signOpts = useMutationStatusNotification({
    successMessage: "Token został wygenerowany",
  });
  const { mutateAsync: signToken, isLoading: isSigningToken } =
    trpc.admin.sources.signToken.useMutation({
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
  const { data: sensors } = trpc.admin.sensors.getTemperatureSensors.useQuery();

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
