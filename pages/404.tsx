// Licensed under the Open Software License version 3.0
import { Button, Center, Container } from "@mantine/core";
import { NextLink } from "@mantine/next";
import Image from "next/future/image";
import Head from "next/head";
import { FileUnknown } from "tabler-icons-react";
import Layout from "../components/Layout";
import bg from "../public/404.svg";
import type { NextPageWithLayout } from "./_app";

const Custom404: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>404: Nie odnaleziono strony</title>
      </Head>
      <Container size="xl" style={{ filter: "brightness(0.9)" }}>
        <Image
          src={bg}
          alt="błąd 404"
          sizes="100vw"
          style={{ width: "100%", height: "auto", maxHeight: "50vh" }}
        />
        <Center mt="xl">
          <Button component={NextLink} href="/" variant="subtle" replace>
            Przenieś mnie na stronę główną
          </Button>
        </Center>
      </Container>
    </>
  );
};

Custom404.getLayout = (page) => (
  <Layout title="Nie odnaleziono strony" icon={<FileUnknown />}>
    {page}
  </Layout>
);

export default Custom404;
