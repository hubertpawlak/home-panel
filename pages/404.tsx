import Head from "next/head";
import { FileUnknown, MoodSad } from "tabler-icons-react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";

const Custom404: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>404: Nie odnaleziono strony</title>
      </Head>
      {/* TODO: 404 page */}
      <MoodSad />
    </>
  );
};

Custom404.getLayout = (page) => (
  <Layout title="404" icon={<FileUnknown />}>
    {page}
  </Layout>
);

export default Custom404;
