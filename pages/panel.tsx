import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import { TemperatureGrid } from "../components/TemperatureGrid";
import { Timeline } from "tabler-icons-react";
import { trpc } from "../utils/trpc";

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
  <Layout title="Panel sterowania" icon={<Timeline />}>
    {page}
  </Layout>
);

export default ControlPanelPage;
