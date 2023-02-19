// Licensed under the Open Software License version 3.0
import { Text } from "@mantine/core";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { DataTable } from "mantine-datatable";
import { Edit, Trash } from "tabler-icons-react";
import type { DisplayedSensor } from "../types/DisplayedSensor";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

export const SensorsTable = () => {
  // Actions
  const { refetch: refetchTemperatureSensors } =
    trpc.admin.sensors.getTemperatureSensors.useQuery();
  const opts = useMutationStatusNotification({
    successMessage: "Czujnik został usunięty",
    onSuccess() {
      refetchTemperatureSensors();
    },
  });
  const { mutateAsync: deleteSensor, isLoading: isDeleting } =
    trpc.admin.sensors.deleteTemperatureSensor.useMutation(opts);
  // Data
  const { data: sensors, isLoading: isLoadingSensors } =
    trpc.admin.sensors.getTemperatureSensors.useQuery();

  return (
    <DataTable<DisplayedSensor>
      records={sensors ?? []}
      idAccessor="hw_id"
      columns={[
        {
          accessor: "hw_id",
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
        items: ({ hw_id }) => [
          {
            key: "edit",
            title: "Edytuj",
            icon: <Edit />,
            disabled: isDeleting,
            onClick() {
              openContextModal({
                modal: "editSensor",
                title: "Edytowanie czujnika",
                innerProps: { hw_id, name },
              });
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
                onConfirm: () => deleteSensor({ hw_id }),
              });
            },
          },
        ],
      }}
      // Styling
      highlightOnHover
      minHeight={
        sensors === undefined || sensors === null || sensors?.length === 0
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
