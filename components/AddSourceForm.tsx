// Licensed under the Open Software License version 3.0
import { Button, Grid, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { openContextModal } from "@mantine/modals";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

export const AddSourceForm = () => {
  const signTokenForm = useForm({ initialValues: { sourceId: "" } });
  const signOpts = useMutationStatusNotification({
    successMessage: "Token został wygenerowany",
    mutatingMessage: "Oczekiwanie na podpisany token",
  });
  const { mutateAsync: signToken, isLoading: isSigningToken } =
    trpc.admin.sources.signToken.useMutation({
      ...signOpts,
      onSuccess(data) {
        openContextModal({
          modal: "showToken",
          title: "Wygenerowano token",
          innerProps: { token: data },
        });
        signOpts.onSuccess?.(null, null, null);
      },
    });

  return (
    <form onSubmit={signTokenForm.onSubmit((values) => signToken(values))}>
      <Grid align="flex-end">
        <Grid.Col span="auto">
          <TextInput
            label="Nazwa źródła"
            placeholder="Garaż"
            {...signTokenForm.getInputProps("sourceId")}
          />
        </Grid.Col>
        <Grid.Col span="content">
          <Button type="submit" disabled={isSigningToken}>
            Utwórz token
          </Button>
        </Grid.Col>
      </Grid>
    </form>
  );
};
