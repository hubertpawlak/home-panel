// Licensed under the Open Software License version 3.0
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { ContextModalProps } from "@mantine/modals";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

type EditSensorProps = ContextModalProps<{
  id: string;
  name: string;
}>;

interface IEditSensor {
  id: string;
  name: string;
}

export const EditSensorModal = ({ innerProps }: EditSensorProps) => {
  // No need for a network call
  // Pass name from table
  const { id, name } = innerProps;
  const form = useForm<IEditSensor>({
    initialValues: {
      id,
      name,
    },
  });

  const { refetch: refetchSensors } = trpc.admin.uds.getSensors.useQuery();
  const mutateOpts = useMutationStatusNotification({
    onSuccess() {
      refetchSensors();
    },
  });
  const { mutate: editSensor, isLoading: isSubmitting } =
    trpc.admin.uds.renameSensor.useMutation(mutateOpts);

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          editSensor(values);
        })}
      >
        <Stack spacing="sm">
          <TextInput
            {...form.getInputProps("id")}
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
