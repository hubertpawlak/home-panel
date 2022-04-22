import Head from "next/head";
import { MoodSad } from "tabler-icons-react";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404: Nie odnaleziono strony</title>
      </Head>
      {/* TODO: 404 page */}
      <MoodSad />
    </>
  );
}
