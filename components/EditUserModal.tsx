import {
  Button,
  MultiSelect,
  Stack,
  TextInput
  } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { trpc } from "../utils/trpc";
import { useForm } from "@mantine/form";
import { useMutationStatusNotification } from "../utils/notifications";
import { useState } from "react";

type EditUserProps = ContextModalProps<{
  userId: string;
}>;

interface IEditUser {
  userId: string;
  roles: string[];
}

export const EditUserModal = ({ innerProps }: EditUserProps) => {
  const { userId } = innerProps;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<IEditUser>({
    initialValues: {
      userId,
      roles: [],
    },
  });

  const { isFetchedAfterMount } = trpc.useQuery(
    ["admin.users.getEditableUserInfo", { userId }],
    {
      refetchOnWindowFocus: false,
      onSuccess(data) {
        form.setValues(data);
      },
    }
  );

  const mutateOpts = useMutationStatusNotification({
    onMutate() {
      setIsSubmitting(true);
    },
  });
  const { mutate: editUser } = trpc.useMutation("admin.users.editUser", {
    ...mutateOpts,
    onSettled() {
      setIsSubmitting(false);
    },
  });

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
