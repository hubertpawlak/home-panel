// Licensed under the Open Software License version 3.0
import { NumberInput } from "@mantine/core";
import { Balancer } from "react-wrap-balancer";
import type { RemoteNumericOption } from "../types/Config";
import { useStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

export const RemoteNumericInput = ({
  remoteNumericOption,
  label,
  description,
  ...otherProps
}: {
  remoteNumericOption: RemoteNumericOption;
  label?: string;
  description?: string;
  placeholder?: string;
}) => {
  // This query will be reused across other numeric options
  const { data: remoteConfig } = trpc.admin.config.getAll.useQuery(undefined, {
    cacheTime: 5,
  });

  // Optimistic mutation
  const trpcContext = trpc.useContext();
  const getConfigQuery = trpcContext.admin.config.getAll;
  const { showMutating, showFailure, showSuccess } = useStatusNotification();
  const { mutateAsync: changeRemoteState } =
    trpc.admin.config.setNumericOption.useMutation({
      useErrorBoundary: false,
      onMutate: async ({ option, value }) => {
        showMutating();
        // Cancel any outgoing queries (so they don't overwrite this optimistic update)
        await getConfigQuery.cancel();
        // Snapshot state
        const previousState = getConfigQuery.getData();
        // Optimistic update
        getConfigQuery.setData(undefined, (state) => ({
          flags: { ...state?.flags },
          numericOptions: { ...state?.numericOptions, [option]: value },
        }));
        // Return context with snapshot
        return { previousState };
      },
      onError: (error, _1, context) => {
        showFailure(
          error.message === "FORBIDDEN"
            ? "Brak uprawnień do zmiany wartości"
            : undefined
        );
        // Rollback snapshot
        getConfigQuery.setData(undefined, context?.previousState);
      },
      onSuccess: () => {
        showSuccess();
      },
      onSettled: () => {
        // Get latest remoteState anyway
        getConfigQuery.invalidate();
      },
    });

  const remoteState = remoteConfig?.numericOptions[remoteNumericOption];
  const remoteStateExists = typeof remoteState === "number";
  const value = remoteState ?? "";

  return (
    <NumberInput
      value={value}
      onChange={(value) => {
        const newState = value === "" ? 0 : value;
        changeRemoteState({ option: remoteNumericOption, value: newState });
      }}
      label={label ?? remoteNumericOption}
      description={<Balancer>{description}</Balancer>}
      error={!remoteStateExists && "Opcja nie istnieje w bazie danych"}
      {...otherProps}
    />
  );
};
