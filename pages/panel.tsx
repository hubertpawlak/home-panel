import Layout from "../components/Layout";
import { rolePower } from "../types/RolePower";
import { TemperatureGrid } from "../components/TemperatureGrid";
import { Timeline } from "tabler-icons-react";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";

const ControlPanelPage: NextPageWithLayout = () => {
  const temps = trpc.useQuery(["sensors.getTemperatures"], {
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
