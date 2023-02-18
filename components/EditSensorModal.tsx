// Licensed under the Open Software License version 3.0
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { ContextModalProps } from "@mantine/modals";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

type EditSensorProps = ContextModalProps<{
  hw_id: string;
  name?: string;
}>;

interface IEditSensor {
  hw_id: string;
  name: string;
}

export const EditSensorModal = ({ innerProps }: EditSensorProps) => {
  // No need for a network call
  // Pass name from table
  const { hw_id, name } = innerProps;
  const form = useForm<IEditSensor>({
    initialValues: {
      hw_id,
      name: name ?? "",
    },
  });

  const { refetch: refetchTemperatureSensors } =
    trpc.admin.sensors.getTemperatureSensors.useQuery();
  const mutateOpts = useMutationStatusNotification({
    onSuccess() {
      refetchTemperatureSensors();
    },
  });
  const { mutate: editSensor, isLoading: isSubmitting } =
    trpc.admin.sensors.renameTemperatureSensor.useMutation(mutateOpts);

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          editSensor(values);
        })}
      >
        <Stack spacing="sm">
          <TextInput
            {...form.getInputProps("hw_id")}
            label="ID sprzętowe sensora"
            readOnly
          />
          <TextInput {...form.getInputProps("name")} label="Nazwa" />
          <Button type="submit" color="green" mt="sm" disabled={isSubmitting}>
            Zapisz
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default EditSensorModal;
