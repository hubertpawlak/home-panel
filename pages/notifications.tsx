import Layout from "../components/Layout";
import { Bell } from "tabler-icons-react";
import { NextPageWithLayout } from "./_app";
import { rolePower } from "../types/RolePower";

const NotificationsPage: NextPageWithLayout = () => {
  return <>{/* TODO: push sub/unsub/status */}</>;
};

NotificationsPage.getLayout = (page) => (
  <Layout
    title="Powiadomienia"
    icon={<Bell />}
    requiredPower={rolePower["user"]}
  >
    {page}
  </Layout>
);

export default NotificationsPage;
