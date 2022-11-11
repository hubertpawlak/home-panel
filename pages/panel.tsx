// Licensed under the Open Software License version 3.0
import { Timeline } from "tabler-icons-react";
import Layout from "../components/Layout";
import { TemperatureGrid } from "../components/TemperatureGrid";
import { rolePower } from "../types/RolePower";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";

const ControlPanelPage: NextPageWithLayout = () => {
  const temps = trpc.sensors.getTemperatures.useQuery(undefined, {
    refetchInterval: 3000,
  });

  return (
    <>
      <TemperatureGrid temps={temps.data} />
    </>
  );
};

ControlPanelPage.getLayout = (page) => (
  <Layout
    title="Panel sterowania"
    icon={<Timeline />}
    requiredPower={rolePower["user"]}
  >
    {page}
  </Layout>
);

export default ControlPanelPage;
