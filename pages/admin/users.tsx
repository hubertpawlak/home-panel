import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import {
  Box,
  Loader,
  Skeleton,
  Switch,
  Text
  } from "@mantine/core";
import { NextPageWithLayout } from "./../_app";
import { Suspense } from "react";
import { ThirdPartyAuth } from "supertokens-auth-react/recipe/thirdparty";
import { trpc } from "../../utils/trpc";
import { useLocalStorage } from "@mantine/hooks";
import { Users } from "tabler-icons-react";

function rowKeyGetter(row: any) {
  return row.id;
}

const UniversalDataGrid = dynamic(
  () => import("../../components/UniversalDataGrid")
);

const UsersPage: NextPageWithLayout = () => {
  const [showEmails, setShowEmails] = useLocalStorage({
    key: "admin-show-emails",
    defaultValue: false,
  });

  const { data: userCount, isLoading: isLoadingUserCount } = trpc.useQuery([
    "admin.users.getCount",
  ]);
  const usersQuery = trpc.useInfiniteQuery(["admin.users.getNewest", {}], {
    getNextPageParam: (data) => data.nextCursor,
  });

  const deleteUsersMutation = trpc.useMutation("admin.users.deleteUsers", {
    useErrorBoundary: false,
  });

  return (
    <>
      <>
        Zarejestrowani użytkownicy:{" "}
        <Text component="span" color="blue" weight="bold">
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
        <UniversalDataGrid
          columns={[
            { field: "id", headerName: "id", minWidth: 330 },
            { field: "tpProvider", headerName: "tpProvider" },
            { field: "tpUserId", headerName: "tpUserId" },
            { field: "timeJoined", headerName: "timeJoined", minWidth: 150 },
            {
              field: "email",
              headerName: "email",
              minWidth: 300,
              // Hide emails if switch is disabled
              renderCell: showEmails
                ? undefined
                : ({ value: email }) => {
                    const emailParts = (email as string).split("@");
                    // Get the user part and censor it
                    const user = "*".repeat(emailParts.shift()?.length ?? 3);
                    const domain = emailParts.join("@") ?? "MISSING_DOMAIN";
                    return (
                      <>
                        {user}@{domain}
                      </>
                    );
                  },
            },
          ]}
          infiniteQuery={usersQuery}
          getRowId={rowKeyGetter}
          deleteText="Usuń konta"
          deleteMutation={deleteUsersMutation}
        />
      </Suspense>
    </>
  );
};

UsersPage.getLayout = (page) => (
  <Layout title="Użytkownicy" icon={<Users />}>
    <ThirdPartyAuth requireAuth>{page}</ThirdPartyAuth>
  </Layout>
);

export default UsersPage;
