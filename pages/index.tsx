import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import { ThirdPartyAuthNoSSR } from "../components/ThirdPartyAuthNoSSR";
import { Timeline } from "tabler-icons-react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const Home: NextPageWithLayout = () => {
  const session = useSessionContext();

  return (
    <>
      <p>session: {JSON.stringify(session, null, 2)}</p>
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
