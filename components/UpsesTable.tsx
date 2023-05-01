// Licensed under the Open Software License version 3.0
import { Text } from "@mantine/core";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import type { UniversalTableRow } from "../types/UniversalTableRow";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

export const UpsesTable = () => {
  // Actions
  const {
    data,
    isLoading: isLoadingUpses,
    refetch: refetchUpses,
  } = trpc.admin.uds.getUpses.useQuery();
  const records = data ?? [];
  const opts = useMutationStatusNotification({
    successMessage: "Zasilacz został usunięty",
    onSuccess() {
      refetchUpses();
    },
  });
  const { mutateAsync: deleteUps, isLoading: isDeleting } =
    trpc.admin.uds.deleteUps.useMutation(opts);

  return (
    <DataTable<UniversalTableRow>
      records={records}
      idAccessor="id"
      columns={[
        {
          accessor: "id",
          title: "ID zasilacza",
        },
        {
          accessor: "name",
          title: "Nazwa",
        },
        {
          accessor: "updated_by",
          title: "Źródło",
        },
      ]}
      fetching={isLoadingUpses}
      // Actions
      rowContextMenu={{
        items: ({ id, name }) => [
          {
            key: "edit",
            title: "Edytuj",
            icon: <IconEdit />,
            disabled: isDeleting,
            onClick() {
              openContextModal({
                modal: "editUps",
                title: "Edytowanie UPSa",
                innerProps: { id, name },
              });
            },
          },
          {
            key: "delete",
            title: "Usuń",
            icon: <IconTrash />,
            color: "red",
            disabled: isDeleting,
            onClick() {
              openConfirmModal({
                title: "Czy na pewno chcesz usunąć tego UPSa?",
                children: (
                  <Text size="sm">
                    Informacje o nim zostaną usunięte z bazy danych, jednak
                    ponowne wykrycie przez źródło danych spowoduje automatycznie
                    ponowne dodanie UPSa.
                  </Text>
                ),
                labels: {
                  confirm: "Tak, usuń zasilacz",
                  cancel: "Nie, anuluj",
                },
                confirmProps: { color: "red" },
                onConfirm: () => deleteUps({ id }),
              });
            },
          },
        ],
      }}
      // Styling
      highlightOnHover
      minHeight={records.length === 0 ? 200 : undefined}
      withBorder
      withColumnBorders
      borderRadius="sm"
      noRecordsText="Brak danych"
      rowSx={{ fontFamily: "monospace", whiteSpace: "nowrap" }}
    />
  );
};
