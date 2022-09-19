import Layout from "../components/Layout";
import { DatabaseImport } from "tabler-icons-react";
import { NextPageWithLayout } from "./_app";
import { rolePower } from "../types/RolePower";

const SourcesPage: NextPageWithLayout = () => {
  return <>{/* TODO: sign token */}</>;
};

SourcesPage.getLayout = (page) => (
  <Layout
    title="Źródła danych"
    icon={<DatabaseImport />}
    requiredPower={rolePower["admin"]}
  >
    {page}
  </Layout>
);

export default SourcesPage;
