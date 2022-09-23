import {
  Button,
  MultiSelect,
  Stack,
  TextInput
  } from "@mantine/core";
import { trpc } from "../utils/trpc";
import { useForm } from "@mantine/form";
import { useMutationStatusNotification } from "../utils/notifications";
import type { ContextModalProps } from "@mantine/modals";

type EditUserProps = ContextModalProps<{
  userId: string;
}>;

interface IEditUser {
  userId: string;
  roles: string[];
}

export const EditUserModal = ({ innerProps }: EditUserProps) => {
  const { userId } = innerProps;
  const form = useForm<IEditUser>({
    initialValues: {
      userId,
      roles: [],
    },
  });

  const { isFetchedAfterMount } = trpc.useQuery(
    ["root.users.getEditableUserInfo", { userId }],
    {
      refetchOnWindowFocus: false,
      onSuccess(data) {
        form.setValues(data);
      },
    }
  );

  const mutateOpts = useMutationStatusNotification();
  const { mutate: editUser, isLoading: isSubmitting } = trpc.useMutation(
    "root.users.editUser",
    mutateOpts
  );

  const disabled = !isFetchedAfterMount || isSubmitting;

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          editUser(values as any);
        })}
      >
        <Stack spacing="sm">
          <TextInput
            {...form.getInputProps("userId")}
            label="UUID użytkownika"
            readOnly
          />
          <MultiSelect
            {...form.getInputProps("roles")}
            label="Role"
            disabled={disabled}
            data={[
              { value: "root", label: "root" },
              { value: "admin", label: "admin" },
              { value: "user", label: "user" },
            ]}
          />
          <Button type="submit" color="green" mt="sm" disabled={disabled}>
            Zapisz
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default EditUserModal;
