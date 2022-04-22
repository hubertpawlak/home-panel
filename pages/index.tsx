import { Timeline } from "tabler-icons-react";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const timestamp = trpc.useQuery(["test.timestamp"]);
  return <>Timestamp: {JSON.stringify(timestamp.data, null, 2)}</>;
};

Home.getLayout = (page) => (
  <Layout title="Panel sterowania" icon={<Timeline />}>
    {page}
  </Layout>
);

export default Home;
