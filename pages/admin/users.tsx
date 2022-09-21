import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import {
  ActionIcon,
  Box,
  Loader,
  Skeleton,
  Switch,
  Text
  } from "@mantine/core";
import { Edit, Users } from "tabler-icons-react";
import { NextPageWithLayout } from "./../_app";
import { openContextModal } from "@mantine/modals";
import { rolePower } from "../../types/RolePower";
import { Suspense } from "react";
import { trpc } from "../../utils/trpc";
import { useLocalStorage } from "@mantine/hooks";

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

  const { data: userCount, isLoading: isLoadingUserCount } = trpc.useQuery(
    ["root.users.getCount"],
    { staleTime: 60 * 1000 }
  );
  const usersQuery = trpc.useInfiniteQuery(["root.users.getNewest", {}], {
    getNextPageParam: (data) => data.nextCursor,
  });

  const deleteUsersMutation = trpc.useMutation("root.users.deleteUsers", {
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
        {/* TODO: switch to Table */}
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
            {
              field: "actions",
              headerName: "actions",
              align: "center",
              renderCell: ({ row }) => {
                return (
                  <>
                    <ActionIcon
                      title="Edytuj"
                      onClick={() => {
                        openContextModal({
                          modal: "editUser",
                          title: "Edytowanie konta",
                          innerProps: { userId: row.id },
                        });
                      }}
                    >
                      <Edit />
                    </ActionIcon>
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
  <Layout
    title="Użytkownicy"
    icon={<Users />}
    requiredPower={rolePower["root"]}
  >
    {page}
  </Layout>
);

export default UsersPage;
