import Layout from "../components/Layout";
import { DatabaseImport } from "tabler-icons-react";
import { NextPageWithLayout } from "./_app";
import { ThirdPartyAuth } from "supertokens-auth-react/recipe/thirdparty";

const SourcesPage: NextPageWithLayout = () => {
  return <></>;
};

SourcesPage.getLayout = (page) => (
  <Layout title="Źródła danych" icon={<DatabaseImport />}>
    <ThirdPartyAuth requireAuth>{page}</ThirdPartyAuth>
  </Layout>
);

export default SourcesPage;
