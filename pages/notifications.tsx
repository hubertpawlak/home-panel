import Layout from "../components/Layout";
import { Bell } from "tabler-icons-react";
import { NextPageWithLayout } from "./_app";

const NotificationsPage: NextPageWithLayout = () => {
  return <>{/* TODO: push sub/unsub/status */}</>;
};

NotificationsPage.getLayout = (page) => (
  <Layout title="Powiadomienia" icon={<Bell />}>
    {page}
  </Layout>
);

export default NotificationsPage;
