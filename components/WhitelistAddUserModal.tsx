import {
  Button,
  Group,
  Modal,
  Select,
  TextInput
  } from "@mantine/core";
import { Check, X } from "tabler-icons-react";
import { SharedModalProps } from "../types/SharedModalProps";
import { trpc } from "../utils/trpc";
import { useForm, zodResolver } from "@mantine/form";
import { useMutationStatusNotification } from "../utils/notifications";
import { whitelistAddUserSchema } from "../sharedSchema/whitelistAddUserSchema";
import { z } from "zod";

export const WhitelistAddUserModal = ({ open, setOpen }: SharedModalProps) => {
  const form = useForm<z.input<typeof whitelistAddUserSchema>>({
    initialValues: {
      userProvider: "github",
      userId: "",
      role: "USER",
    },
    schema: zodResolver(whitelistAddUserSchema),
  });

  const addUserMutationOptions = useMutationStatusNotification({
    successMessage: "Dodano użytkownika do białej listy",
    onSuccess: () => {
      refetchQueries(["admin.whitelist.getUsers"]);
      form.reset();
      setOpen(false);
    },
  });

  const { refetchQueries } = trpc.useContext();
  const { mutate: addUser, isLoading } = trpc.useMutation(
    "admin.whitelist.addUser",
    addUserMutationOptions
  );

  return (
    <Modal
      opened={open}
      onClose={() => {
        if (isLoading) return;
        setOpen(false);
      }}
      title="Dodawanie użytkownika do białej listy"
    >
      <form
        onSubmit={form.onSubmit((v) => {
          addUser(v);
        })}
      >
        <Select
          required
          label="Dostawca tożsamości użytkownika"
          data={[{ value: "github", label: "GitHub" }]}
          disabled={isLoading}
          {...form.getInputProps("userProvider")}
        />
        <TextInput
          required
          autoFocus
          label="Zewnętrzne ID użytkownika"
          placeholder="12345678"
          disabled={isLoading}
          {...form.getInputProps("userId")}
        />
        <Select
          required
          label="Rola użytkownika"
          data={[
            { value: "GUEST", label: "Gość" },
            { value: "USER", label: "Użytkownik" },
            { value: "ADMIN", label: "Administrator" },
          ]}
          disabled={isLoading}
          {...form.getInputProps("role")}
        />
        <Group position="right" mt="md">
          <Button
            type="reset"
            color="red"
            leftIcon={<X />}
            disabled={isLoading}
            onClick={() => form.reset()}
          >
            Wyczyść
          </Button>
          <Button
            type="submit"
            color="green"
            leftIcon={<Check />}
            disabled={isLoading}
          >
            Dodaj
          </Button>
        </Group>
      </form>
    </Modal>
  );
};
