import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import { SectionSign } from "tabler-icons-react";

const TosPage: NextPageWithLayout = () => {
  return <></>;
};

TosPage.getLayout = (page) => (
  <Layout title="Warunki Korzystania" icon={<SectionSign />}>
    {page}
  </Layout>
);

export default TosPage;
