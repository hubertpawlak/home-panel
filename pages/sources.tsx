// Licensed under the Open Software License version 3.0
import { Container, Stack, Text, Title } from "@mantine/core";
import { IconDatabaseImport } from "@tabler/icons-react";
import Balancer from "react-wrap-balancer";
import { AddSourceForm } from "../components/AddSourceForm";
import Layout from "../components/Layout";
import { SensorsTable } from "../components/SensorsTable";
import { rolePower } from "../types/RolePower";
import type { NextPageWithLayout } from "./_app";

const SourcesPage: NextPageWithLayout = () => {
  return (
    <Container size="xl">
      <Stack spacing="xs">
        {/* Source token signing form */}
        <Title align="center">Dodaj źródło</Title>
        <AddSourceForm />
        <Text color="dimmed" align="center">
          <Balancer>
            Utworzone tokeny są&nbsp;ważne bezterminowo i&nbsp;nie można ich
            pojedynczo unieważnić. Obecnie wymagałoby to zmiany kluczy używanych
            przez serwer, a&nbsp;więc unieważnienia wszystkich źródeł. Tokeny
            zawierają podpisane cyfrowo informacje o&nbsp;źródle danych, takie
            jak&nbsp;nazwa. Każde źródło powinno mieć swój token.
          </Balancer>
        </Text>
        {/* List of all known temperature sensors */}
        <Title align="center">Czujniki temperatury</Title>
        <SensorsTable />
      </Stack>
    </Container>
  );
};

SourcesPage.getLayout = (page) => (
  <Layout
    title="Źródła danych"
    icon={<IconDatabaseImport />}
    requiredPower={rolePower["admin"]}
  >
    {page}
  </Layout>
);

export default SourcesPage;
