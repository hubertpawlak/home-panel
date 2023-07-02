// Licensed under the Open Software License version 3.0
import { Container, Stack, Text, Title } from "@mantine/core";
import { IconServerCog } from "@tabler/icons-react";
import { Balancer } from "react-wrap-balancer";
import Layout from "../../components/Layout";
import { RemoteFlagSwitch } from "../../components/RemoteFlagSwitch";
import { RemoteNumericInput } from "../../components/RemoteNumericInput";
import { defaultEdgeConfigValues } from "../../types/EdgeConfig";
import { rolePower } from "../../types/RolePower";
import type { NextPageWithLayout } from "../_app";

const ConfigPage: NextPageWithLayout = () => {
  return (
    <Container size="xl">
      <Stack spacing="xs">
        <Title align="center">Ustawienia powiadomień</Title>
        <RemoteNumericInput
          remoteNumericOption="pushNotifyAbove"
          description="Próg temperaturowy w&nbsp;stopniach Celsjusza, po&nbsp;którego osiągnięciu przez&nbsp;dowolny czujnik, zostanie wysłane powiadomienie"
          placeholder={defaultEdgeConfigValues.pushNotifyAbove.toString()}
        />
        <RemoteNumericInput
          remoteNumericOption="pushTTLSeconds"
          description="Czas w&nbsp;sekundach przed&nbsp;wysłaniem kolejnego powiadomienia, po&nbsp;spadku temperatury poniżej progu przez&nbsp;wszystkie czujniki"
          placeholder={defaultEdgeConfigValues.pushTTLSeconds.toString()}
        />
        <Title align="center">Funkcje instalacyjne</Title>
        <Text color="dimmed" align="center">
          <Balancer>
            Po wstępnej konfiguracji powinny być wyłączone. Nie używaj, jeśli
            nie wiesz co robisz!
          </Balancer>
        </Text>
        <RemoteFlagSwitch
          remoteFlag="seedRouter_initRedis"
          description="seed.initRedis: Funkcja resetująca podstawowe flagi w bazie danych Redis"
        />
        <RemoteFlagSwitch
          remoteFlag="seedRouter_generateVapidKeys"
          description="seed.generateVapidKeys: Funkcja generująca klucze VAPID"
        />
        <RemoteFlagSwitch
          remoteFlag="seedRouter_generateKeys"
          description="seed.generateKeys: Funkcja generująca klucze do JWT"
        />
        <RemoteFlagSwitch
          remoteFlag="seedRouter_createDefaultRoles"
          description="seed.createDefaultRoles: Funkcja tworząca domyślne role"
        />
        <RemoteFlagSwitch
          remoteFlag="seedRouter_addRootRole"
          description="seed.addRootRole: Funkcja nadająca najwyższe uprawnienia"
        />
      </Stack>
    </Container>
  );
};

ConfigPage.getLayout = (page) => (
  <Layout
    title="Zaawansowane ustawienia"
    icon={<IconServerCog />}
    requiredPower={rolePower["admin"]}
  >
    {page}
  </Layout>
);

export default ConfigPage;
