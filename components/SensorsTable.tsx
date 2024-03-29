// Licensed under the Open Software License version 3.0
import { Text } from "@mantine/core";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import type { UniversalTableRow } from "../types/UniversalTableRow";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

export const SensorsTable = () => {
  // Actions
  const {
    data,
    isLoading: isLoadingSensors,
    refetch: refetchSensors,
  } = trpc.admin.uds.getSensors.useQuery();
  const records = data ?? [];
  const opts = useMutationStatusNotification({
    successMessage: "Czujnik został usunięty",
    onSuccess() {
      refetchSensors();
    },
  });
  const { mutateAsync: deleteSensor, isLoading: isDeleting } =
    trpc.admin.uds.deleteSensor.useMutation(opts);

  return (
    <DataTable<UniversalTableRow>
      records={records}
      idAccessor="id"
      columns={[
        {
          accessor: "id",
          title: "ID czujnika",
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
      fetching={isLoadingSensors}
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
                modal: "editSensor",
                title: "Edytowanie czujnika",
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
                title: "Czy na pewno chcesz usunąć ten czujnik?",
                children: (
                  <Text size="sm">
                    Informacje o nim zostaną usunięte z bazy danych, jednak
                    ponowne wykrycie przez źródło danych spowoduje automatycznie
                    ponowne dodanie czujnika.
                  </Text>
                ),
                labels: {
                  confirm: "Tak, usuń czujnik",
                  cancel: "Nie, anuluj",
                },
                confirmProps: { color: "red" },
                onConfirm: () => deleteSensor({ id }),
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
