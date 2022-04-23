import { Timeline } from "tabler-icons-react";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const userInfo = trpc.useQuery(["test.userInfo"], { refetchInterval: 1000 });
  return (
    <>
      <p>User: {JSON.stringify(userInfo.data, null, 2)}</p>
    </>
  );
};

Home.getLayout = (page) => (
  <Layout title="Panel sterowania" icon={<Timeline />}>
    {page}
  </Layout>
);

export default Home;
