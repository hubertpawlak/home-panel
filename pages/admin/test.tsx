import Layout from "../../components/Layout";
import { Button, Code } from "@mantine/core";
import { NextPageWithLayout } from "../_app";
import { TestPipe } from "tabler-icons-react";
import { ThirdPartyAuth } from "supertokens-auth-react/recipe/thirdparty";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from "react";

const TestPage: NextPageWithLayout = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage: hasNextPageToFetch,
  } = trpc.useInfiniteQuery(["test.getInfNumbers", {}], {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const fetchedPages = data?.pages ?? [];
  const [visiblePageNumber, setVisiblePageNumber] = useState(0);
  const inOnFirstPage = visiblePageNumber <= 0;
  const isOnLastFetchedPage = visiblePageNumber >= fetchedPages.length - 1;

  useEffect(() => {
    // Fetch next page in background
    if (!hasNextPageToFetch) return;
    if (!isOnLastFetchedPage) return;
    fetchNextPage();
  });

  return (
    <>
      <Code block my="md">
        {JSON.stringify(data)}
      </Code>
      <Code block my="md">
        {JSON.stringify(fetchedPages[visiblePageNumber], null, 2)}
      </Code>
      <Button
        mr="md"
        disabled={inOnFirstPage}
        onClick={() => {
          setVisiblePageNumber((v) => v - 1);
        }}
      >
        Previous
      </Button>
      <Button
        mr="md"
        disabled={!hasNextPageToFetch && isOnLastFetchedPage}
        onClick={async () => {
          setVisiblePageNumber((v) => v + 1);
        }}
      >
        Next
      </Button>
    </>
  );
};

TestPage.getLayout = (page) => (
  <Layout title="Strona testowa" icon={<TestPipe />}>
    <ThirdPartyAuth requireAuth>{page}</ThirdPartyAuth>
  </Layout>
);

export default TestPage;
