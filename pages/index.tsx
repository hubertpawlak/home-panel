import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import { TemperatureGrid } from "../components/TemperatureGrid";
import { ThirdPartyAuthNoSSR } from "../components/ThirdPartyAuthNoSSR";
import { Timeline } from "tabler-icons-react";
import { trpc } from "../utils/trpc";

const Home: NextPageWithLayout = () => {
  const temps = trpc.useQuery(["sensors.getTemperatures"], {
    refetchInterval: 3000,
  });

  return (
    <>
      <TemperatureGrid temps={temps.data} />
    </>
  );
};

Home.getLayout = (page) => (
  <Layout title="Panel sterowania" icon={<Timeline />}>
    <ThirdPartyAuthNoSSR requireAuth={false} key="IndexPage">
      {page}
    </ThirdPartyAuthNoSSR>
  </Layout>
);

export default Home;
