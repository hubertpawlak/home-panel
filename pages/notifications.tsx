import Layout from "../components/Layout";
import { Bell } from "tabler-icons-react";
import { NextPageWithLayout } from "./_app";
import { ThirdPartyAuth } from "supertokens-auth-react/recipe/thirdparty";

const NotificationsPage: NextPageWithLayout = () => {
  return <>{/* TODO: push sub/unsub/status */}</>;
};

NotificationsPage.getLayout = (page) => (
  <Layout title="Powiadomienia" icon={<Bell />}>
    <ThirdPartyAuth requireAuth>{page}</ThirdPartyAuth>
  </Layout>
);

export default NotificationsPage;
