// Licensed under the Open Software License version 3.0
import {
  ActionIcon,
  Box,
  Container,
  Group,
  Loader,
  Skeleton,
  Switch,
  Text,
} from "@mantine/core";
import { useCounter, useLocalStorage } from "@mantine/hooks";
import { Suspense, useEffect } from "react";
import { PlayerTrackNext, PlayerTrackPrev, Users } from "tabler-icons-react";
import Layout from "../../components/Layout";
import { UsersTable } from "../../components/UsersTable";
import { rolePower } from "../../types/RolePower";
import { trpc } from "../../utils/trpc";
import type { NextPageWithLayout } from "./../_app";

const UsersPage: NextPageWithLayout = () => {
  // User count
  const { data: userCount, isLoading: isLoadingUserCount } =
    trpc.root.users.getCount.useQuery(undefined, { staleTime: 60 * 1000 });
  // Users table
  const [showEmails, setShowEmails] = useLocalStorage({
    key: "admin-show-emails",
    defaultValue: false,
  });
  const { data, fetchNextPage, hasNextPage, isLoading } =
    trpc.root.users.getNewest.useInfiniteQuery(
      {},
      {
        getNextPageParam: (data) => data.nextCursor,
        refetchOnWindowFocus: false,
      }
    );
  const [visiblePage, { decrement: prevPage, increment: nextPage }] =
    useCounter(0, { min: 0 });
  const allFetchedPages = data?.pages ?? [];
  const inOnFirstPage = visiblePage <= 0;
  const isOnLastFetchedPage = visiblePage >= (data?.pages.length ?? 0) - 1;
  const disableNextButton = (!hasNextPage && isOnLastFetchedPage) || isLoading;

  useEffect(() => {
    // Fetch next page in the background
    if (!hasNextPage) return;
    if (!isOnLastFetchedPage) return;
    fetchNextPage();
  });

  return (
    <Container size="xl">
      <>
        Zarejestrowani użytkownicy:{" "}
        <Text component="span" weight="bold" inline>
          {isLoadingUserCount ? <Loader variant="dots" /> : userCount}
        </Text>
      </>
      <Suspense fallback={<Skeleton height={200} />}>
        <Box py="md">
          <Switch
            label="Pokaż adresy email"
            checked={showEmails}
            onChange={(e) => {
              setShowEmails(e.currentTarget.checked);
            }}
          />
        </Box>
        <UsersTable
          users={allFetchedPages[visiblePage]?.rows}
          showEmails={showEmails}
        />
        <Group position="right">
          <ActionIcon
            title="Poprzednia strona"
            variant="transparent"
            disabled={inOnFirstPage}
            onClick={prevPage}
          >
            <PlayerTrackPrev />
          </ActionIcon>
          <Text>Strona {visiblePage + 1}</Text>
          <ActionIcon
            title="Następna strona"
            variant="transparent"
            disabled={disableNextButton}
            onClick={nextPage}
          >
            <PlayerTrackNext />
          </ActionIcon>
        </Group>
      </Suspense>
    </Container>
  );
};

UsersPage.getLayout = (page) => (
  <Layout
    title="Użytkownicy"
    icon={<Users />}
    requiredPower={rolePower["root"]}
  >
    {page}
  </Layout>
);

export default UsersPage;
