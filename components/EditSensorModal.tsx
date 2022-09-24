import { Button, Stack, TextInput } from "@mantine/core";
import { trpc } from "../utils/trpc";
import { useForm } from "@mantine/form";
import { useMutationStatusNotification } from "../utils/notifications";
import type { ContextModalProps } from "@mantine/modals";

type EditSensorProps = ContextModalProps<{
  hwId: string;
  name?: string;
}>;

interface IEditSensor {
  hwId: string;
  name: string;
}

export const EditSensorModal = ({ innerProps }: EditSensorProps) => {
  // No need for a network call
  // Pass name from table
  const { hwId, name } = innerProps;
  const form = useForm<IEditSensor>({
    initialValues: {
      hwId,
      name: name ?? "",
    },
  });

  const { refetchQueries } = trpc.useContext();
  const mutateOpts = useMutationStatusNotification({
    onSuccess() {
      refetchQueries(["admin.sensors.getTemperatureSensors"]);
    },
  });
  const { mutate: editSensor, isLoading: isSubmitting } = trpc.useMutation(
    "admin.sensors.renameTemperatureSensor",
    mutateOpts
  );

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          editSensor(values);
        })}
      >
        <Stack spacing="sm">
          <TextInput
            {...form.getInputProps("hwId")}
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
