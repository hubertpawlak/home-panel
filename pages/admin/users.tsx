// Licensed under the Open Software License version 3.0
import { Box, Container, Loader, Skeleton, Switch, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Users } from "@tabler/icons-react";
import { Suspense } from "react";
import Layout from "../../components/Layout";
import { UsersTable } from "../../components/UsersTable";
import { rolePower } from "../../types/RolePower";
import { trpc } from "../../utils/trpc";
import type { NextPageWithLayout } from "./../_app";

const UsersPage: NextPageWithLayout = () => {
  const { data: userCount, isLoading: isLoadingUserCount } =
    trpc.root.users.getCount.useQuery(undefined, { staleTime: 60 * 1000 });

  const [showEmails, setShowEmails] = useLocalStorage({
    key: "admin-show-emails",
    defaultValue: false,
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
        <UsersTable showEmails={showEmails} />
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
