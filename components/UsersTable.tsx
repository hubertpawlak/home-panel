// Licensed under the Open Software License version 3.0
import { Text } from "@mantine/core";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { DataTable } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { Ban, Edit, Trash } from "tabler-icons-react";
import type { DisplayedUser } from "../types/DisplayedUser";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

interface IUsersTable {
  showEmails?: boolean;
}

export const UsersTable = ({ showEmails }: IUsersTable) => {
  // Actions
  const trpcContext = trpc.useContext();
  const opts = useMutationStatusNotification({
    successMessage: "Konto zostało usunięte",
    onSuccess() {
      trpcContext.root.users.getNewest.refetch();
      trpcContext.root.users.getCount.invalidate();
    },
  });
  const { mutateAsync: deleteUsers, isLoading: isDeleting } =
    trpc.root.users.deleteUsers.useMutation(opts);
  // Data
  const maxRowsPerPage = 10;
  const {
    data: usersPages,
    fetchNextPage: fetchNextUsersPage,
    hasNextPage: hasNextUsersPage,
    isLoading: isLoadingUsers,
  } = trpc.root.users.getNewest.useInfiniteQuery(
    { maxRowsPerPage },
    {
      getNextPageParam: (data) => data.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
  // View
  const [page, setPage] = useState(1);
  const usersCurrentPage = usersPages?.pages[page - 1]?.rows ?? [];
  const isOnLastFetchedPage = usersPages?.pages.length === page;
  const fetchedUserCount = useMemo(
    () => (usersPages?.pages ?? []).reduce((acc, v) => acc + v.rows.length, 0),
    [usersPages?.pages]
  );

  useEffect(() => {
    // Fetch next page in the background
    if (!hasNextUsersPage) return;
    if (!isOnLastFetchedPage) return;
    fetchNextUsersPage();
  });

  return (
    <DataTable<DisplayedUser>
      // Data
      records={usersCurrentPage}
      idAccessor="id"
      columns={[
        { accessor: "id", title: "ID wewnętrzne" },
        { accessor: "tpProvider", title: "Dostawca" },
        { accessor: "tpUserId", title: "ID zewnętrzne" },
        { accessor: "timeJoined", title: "Czas dołączenia" },
        {
          accessor: "email",
          title: "Email",
          width: "100%",
          render({ email }) {
            if (showEmails) return email;
            const emailParts = email.split("@");
            const user = "*".repeat(emailParts.shift()?.length ?? 3);
            const domain = emailParts.join("@") ?? "MISSING_DOMAIN";
            return `${user}@${domain}`;
          },
        },
      ]}
      fetching={isLoadingUsers}
      // Pagination
      page={page}
      totalRecords={Math.max(fetchedUserCount, usersCurrentPage.length)}
      onPageChange={(newPageNumber) => setPage(newPageNumber)}
      recordsPerPage={maxRowsPerPage}
      // TODO: shift+click to bypass prompt
      // Actions
      rowContextMenu={{
        items: ({ id }) => [
          {
            key: "edit",
            title: "Edytuj",
            icon: <Edit />,
            disabled: isDeleting,
            onClick() {
              openContextModal({
                modal: "editUser",
                title: "Edytowanie konta",
                innerProps: { userId: id },
              });
            },
          },
          { key: "divider1", divider: true },
          {
            key: "ban",
            title: "Zablokuj",
            icon: <Ban />,
            color: "yellow",
            disabled: isDeleting,
            hidden: true, // TODO: implement account ban
            onClick() {
              console.log("NOT IMPLEMENTED");
            },
          },
          {
            key: "delete",
            title: "Usuń",
            icon: <Trash />,
            color: "red",
            disabled: isDeleting,
            onClick() {
              openConfirmModal({
                title: "Czy na pewno chcesz usunąć to konto?",
                children: (
                  <Text size="sm">
                    Informacje o koncie zostaną usunięte z bazy danych.
                    <br />
                    Ta akcja jest nieodwracalna.
                  </Text>
                ),
                labels: {
                  confirm: "Tak, usuń konto",
                  cancel: "Nie, anuluj",
                },
                confirmProps: { color: "red" },
                onConfirm: () => deleteUsers([id]),
              });
            },
          },
        ],
      }}
      // Styling
      highlightOnHover
      minHeight={
        usersCurrentPage === undefined || usersCurrentPage?.length === 0
          ? 200
          : undefined
      }
      withBorder
      withColumnBorders
      borderRadius="sm"
      noRecordsText="Brak danych"
      rowSx={{ fontFamily: "monospace", whiteSpace: "nowrap" }}
    />
  );
};
