// Licensed under the Open Software License version 3.0
import { Accordion, Anchor, Stack, Text, Title } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Balancer from "react-wrap-balancer";
import Layout from "../components/Layout";
import licenseInfos from "../oss-attribution/licenseInfos.json";
import type { NextPageWithLayout } from "./_app";

export const getStaticProps: GetStaticProps<{
  dependencies: typeof licenseInfos;
}> = async () => {
  return {
    props: {
      dependencies: licenseInfos,
    },
  };
};

const SpecialThanksPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ dependencies }) => {
  return (
    <Stack>
      <Title align="center">Podziękowania</Title>
      <Text>
        <Balancer>
          Witaj 👋 Jeżeli tutaj jesteś, to znaczy że chcesz wiedzieć, kto pomógł
          mi w tworzeniu tego projektu. W takim razie, zapraszam do przeczytania
          tej sekcji. Znajdziesz tu informacje o zależnościach, które
          wykorzystuję w tym projekcie oraz o ich autorach.
        </Balancer>
      </Text>
      <Accordion multiple variant="contained">
        {dependencies.map(({ authors, license, licenseText, name, url }) => {
          return (
            <Accordion.Item key={name} value={name}>
              <Accordion.Control>
                {name} ({license})
              </Accordion.Control>
              <Accordion.Panel>
                <Text italic>{authors}</Text>
                <Anchor href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </Anchor>
                <pre>{licenseText}</pre>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Stack>
  );
};

SpecialThanksPage.getLayout = (page) => (
  <Layout title="Podziękowania" icon={<IconHeart />}>
    {page}
  </Layout>
);

export default SpecialThanksPage;
