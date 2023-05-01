// Licensed under the Open Software License version 3.0
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { ContextModalProps } from "@mantine/modals";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

type EditUpsProps = ContextModalProps<{
  id: string;
  name: string;
}>;

interface IEditUps {
  id: string;
  name: string;
}

export const EditUpsModal = ({ innerProps }: EditUpsProps) => {
  // No need for a network call
  // Pass name from table
  const { id, name } = innerProps;
  const form = useForm<IEditUps>({
    initialValues: {
      id,
      name,
    },
  });

  const { refetch: refetchUpses } = trpc.admin.uds.getUpses.useQuery();
  const mutateOpts = useMutationStatusNotification({
    onSuccess() {
      refetchUpses();
    },
  });
  const { mutate: editUps, isLoading: isSubmitting } =
    trpc.admin.uds.renameUps.useMutation(mutateOpts);

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          editUps(values);
        })}
      >
        <Stack spacing="sm">
          <TextInput
            {...form.getInputProps("id")}
            label="ID sprzętowe UPSa"
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

export default EditUpsModal;
