import Layout from "../../components/Layout";
import { Box, Grid, TextInput } from "@mantine/core";
import { MinimumRoleAllowedToLoginSelector } from "../../components/MinimumRoleAllowedToLoginSelector";
import { NextPageWithLayout } from "../_app";
import { trpc } from "../../utils/trpc";
import { UniversalDataGrid } from "../../components/UniversalDataGrid";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutationStatusNotification } from "../../utils/notifications";
import { UserCheck } from "tabler-icons-react";
import { useState } from "react";
import { Whitelist } from "@prisma/client";
import { WhitelistAddUserModal } from "../../components/WhitelistAddUserModal";

function rowKeyGetter(row: Whitelist) {
  return row.entryId;
}

const WhitelistPage: NextPageWithLayout = () => {
  // User search query
  const [findUserQuery, setFindUserQuery] = useState("");
  const [debouncedFindUserQuery] = useDebouncedValue(findUserQuery, 200, {
    leading: true,
  });
  // List of whitelisted users
  const whitelistedUsersQuery = trpc.useInfiniteQuery(
    ["admin.whitelist.getUsers", { search: debouncedFindUserQuery }],
    { getNextPageParam: (data) => data.nextCursor }
  );
  // Edit user RPC
  const editUserMutationOptions = useMutationStatusNotification();
  const editUserMutation = trpc.useMutation(
    "admin.whitelist.editUser",
    editUserMutationOptions
  );
  // Delete users RPC
  const removeUsersFromWhitelistMutationOptions = useMutationStatusNotification(
    {
      successMessage: "Dane zostały usunięte",
    }
  );
  const removeUsersFromWhitelistMutation = trpc.useMutation(
    "admin.whitelist.removeUsers",
    removeUsersFromWhitelistMutationOptions
  );

  return (
    <>
      <Grid align="flex-end" justify="center" grow>
        {/* Min role selector */}
        <Grid.Col xs={12} sm={6} md={4} lg={3} xl={2}>
          <MinimumRoleAllowedToLoginSelector />
        </Grid.Col>

        {/* Search */}
        <Grid.Col xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextInput
            label="Wyszukiwanie użytkowników"
            placeholder="ID wpisu / Zewnętrzne ID użytkownika"
            value={findUserQuery}
            onChange={(e) => setFindUserQuery(e.currentTarget.value)}
          />
        </Grid.Col>
      </Grid>

      {/* Data grid */}
      <Box my="md">
        <UniversalDataGrid
          columns={[
            { field: "entryId", headerName: "ID wpisu", minWidth: 330 },
            { field: "userProvider", headerName: "Dostawca tożsamości" },
            {
              field: "userId",
              headerName: "Zewnętrzne ID użytkownika",
              editable: true,
            },
            { field: "role", headerName: "Rola", editable: true },
          ]}
          infiniteQuery={whitelistedUsersQuery}
          getRowId={rowKeyGetter}
          addText="Dodaj do białej listy"
          AddModal={WhitelistAddUserModal}
          editMutation={editUserMutation}
          deleteText="Usuń z białej listy"
          deleteMutation={removeUsersFromWhitelistMutation}
        />
      </Box>
    </>
  );
};

WhitelistPage.getLayout = (page) => (
  <Layout title="Biała lista" icon={<UserCheck />}>
    {page}
  </Layout>
);

export default WhitelistPage;
