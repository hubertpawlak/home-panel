import Layout from "../components/Layout";
import { DatabaseImport } from "tabler-icons-react";
import { NextPageWithLayout } from "./_app";

const SourcesPage: NextPageWithLayout = () => {
  return <></>;
};

SourcesPage.getLayout = (page) => (
  <Layout title="Źródła danych" icon={<DatabaseImport />}>
    {page}
  </Layout>
);

export default SourcesPage;
