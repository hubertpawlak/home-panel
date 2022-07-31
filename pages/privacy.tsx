import Layout from "../components/Layout";
import { Cookie } from "tabler-icons-react";
import { NextPageWithLayout } from "./_app";

const PrivacyPage: NextPageWithLayout = () => {
  return <></>;
};

PrivacyPage.getLayout = (page) => (
  <Layout title="Polityka Prywatności" icon={<Cookie />}>
    {page}
  </Layout>
);

export default PrivacyPage;
