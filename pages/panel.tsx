// Licensed under the Open Software License version 3.0
import { Stack, Title } from "@mantine/core";
import { IconTimeline } from "@tabler/icons-react";
import Layout from "../components/Layout";
import { NoDataToShow } from "../components/NoDataToShow";
import { TemperatureGrid } from "../components/TemperatureGrid";
import { UpsGrid } from "../components/UpsGrid";
import { rolePower } from "../types/RolePower";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";

const ControlPanelPage: NextPageWithLayout = () => {
  // Get temperature sensors
  const { data: temperatureSensors } = trpc.uds.getTemperatureSensors.useQuery(
    undefined,
    {
      refetchInterval: 3000,
    }
  );
  // Get upses
  const { data: upses } = trpc.uds.getUpses.useQuery(undefined, {
    refetchInterval: 3000,
  });

  return (
    <Stack>
      <Title>Czujniki</Title>
      {temperatureSensors && temperatureSensors.length > 0 ? (
        <TemperatureGrid temperatureSensors={temperatureSensors} />
      ) : (
        <NoDataToShow />
      )}
      <Title>Zasilacze awaryjne</Title>
      {upses && upses.length > 0 ? <UpsGrid upses={upses} /> : <NoDataToShow />}
    </Stack>
  );
};

ControlPanelPage.getLayout = (page) => (
  <Layout
    title="Panel sterowania"
    icon={<IconTimeline />}
    requiredPower={rolePower["user"]}
  >
    {page}
  </Layout>
);

export default ControlPanelPage;
