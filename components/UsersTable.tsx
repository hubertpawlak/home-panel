// Licensed under the Open Software License version 3.0
import { ActionIcon, Button, ScrollArea, Table, Text } from "@mantine/core";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { Edit, Trash } from "tabler-icons-react";
import type { DisplayedUser } from "../types/DisplayedUser";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

interface IUsersTable {
  users?: DisplayedUser[];
  showEmails?: boolean;
}

export const UsersTable = ({ users, showEmails }: IUsersTable) => {
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

  return (
    <ScrollArea type="auto" offsetScrollbars>
      <Table
        highlightOnHover
        style={{ fontFamily: "monospace", whiteSpace: "nowrap" }}
      >
        <thead>
          <tr>
            <th>ID wewnętrzne</th>
            <th>Dostawca</th>
            <th>ID zewnętrzne</th>
            <th>Czas dołączenia</th>
            <th style={{ width: "100%" }}>Email</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(({ id, tpProvider, tpUserId, timeJoined, email }) => {
            // Hide first part of email if !showEmail
            const emailParts = email.split("@");
            const user = "*".repeat(emailParts.shift()?.length ?? 3);
            const domain = emailParts.join("@") ?? "MISSING_DOMAIN";
            const _email = showEmails ? email : `${user}@${domain}`;
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{tpProvider}</td>
                <td>{tpUserId}</td>
                <td>{timeJoined}</td>
                <td>
                  <Text
                    variant="link"
                    component="a"
                    href={`mailto:${email}`}
                    style={{ fontFamily: "monospace" }}
                  >
                    {_email}
                  </Text>
                </td>
                <td>
                  <Button.Group>
                    <ActionIcon
                      title="Edytuj"
                      variant="transparent"
                      disabled={isDeleting}
                      onClick={() =>
                        openContextModal({
                          modal: "editUser",
                          title: "Edytowanie konta",
                          innerProps: { userId: id },
                        })
                      }
                    >
                      <Edit />
                    </ActionIcon>
                    <ActionIcon
                      title="Usuń konto"
                      color="red.8"
                      variant="transparent"
                      disabled={isDeleting}
                      onClick={() =>
                        openConfirmModal({
                          title: "Czy na pewno chcesz usunąć to konto?",
                          children: (
                            <Text size="sm">
                              Informacje o koncie zostaną usunięte z bazy
                              danych.
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
                        })
                      }
                    >
                      <Trash />
                    </ActionIcon>
                  </Button.Group>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </ScrollArea>
  );
};
