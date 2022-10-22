import { ActionIcon, Button, ScrollArea, Table, Text } from "@mantine/core";
import { openConfirmModal, openContextModal } from "@mantine/modals";
import { Edit, Trash } from "tabler-icons-react";
import type { DisplayedSensor } from "../types/DisplayedSensor";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

interface ISensorsTable {
  sensors?: DisplayedSensor[] | null;
}

export const SensorsTable = ({ sensors }: ISensorsTable) => {
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

  return (
    <ScrollArea type="auto" offsetScrollbars>
      <Table
        highlightOnHover
        style={{ fontFamily: "monospace", whiteSpace: "nowrap" }}
      >
        <thead>
          <tr>
            <th>ID czujnika</th>
            <th style={{ width: "100%" }}>Nazwa</th>
            <th>Źródło</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {sensors?.map(({ hwId, name, updated_by }) => {
            return (
              <tr key={hwId}>
                <td>{hwId}</td>
                <td>{name}</td>
                <td>{updated_by}</td>
                <td>
                  <Button.Group>
                    <ActionIcon
                      title="Edytuj"
                      variant="transparent"
                      disabled={isDeleting}
                      onClick={() =>
                        openContextModal({
                          modal: "editSensor",
                          title: "Edytowanie czujnika",
                          innerProps: { hwId, name },
                        })
                      }
                    >
                      <Edit />
                    </ActionIcon>
                    <ActionIcon
                      title="Usuń czujnik"
                      color="red.8"
                      variant="transparent"
                      disabled={isDeleting}
                      onClick={() =>
                        openConfirmModal({
                          title: "Czy na pewno chcesz usunąć ten czujnik?",
                          children: (
                            <Text size="sm">
                              Informacje o nim zostaną usunięte z bazy danych,
                              jednak ponowne wykrycie przez źródło danych
                              spowoduje automatycznie ponowne dodanie czujnika.
                            </Text>
                          ),
                          labels: {
                            confirm: "Tak, usuń czujnik",
                            cancel: "Nie, anuluj",
                          },
                          confirmProps: { color: "red" },
                          onConfirm: () => deleteSensor({ hwId }),
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
