import { Timeline } from "tabler-icons-react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return <>asd</>;
};

Home.getLayout = (page) => (
  <Layout title="Panel sterowania" icon={<Timeline />}>
    {page}
  </Layout>
);

export default Home;
