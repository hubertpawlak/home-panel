// Licensed under the Open Software License version 3.0
import { Switch } from "@mantine/core";
import type { RemoteFlag } from "../types/Config";
import { useStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";

export const RemoteFlagSwitch = ({
  remoteFlag,
  label,
  ...otherProps
}: {
  remoteFlag: RemoteFlag;
  label?: string;
  description?: string;
}) => {
  // This query will be reused across other switches
  const { data: remoteConfig } = trpc.admin.config.getAll.useQuery(undefined, {
    cacheTime: 2,
  });

  // Optimistic mutation
  const trpcContext = trpc.useContext();
  const getConfigQuery = trpcContext.admin.config.getAll;
  const { showMutating, showFailure, showSuccess } = useStatusNotification();
  const { mutateAsync: changeRemoteState } =
    trpc.admin.config.setFlag.useMutation({
      useErrorBoundary: false,
      onMutate: async ({ flag, value }) => {
        showMutating();
        // Cancel any outgoing queries (so they don't overwrite this optimistic update)
        await getConfigQuery.cancel();
        // Snapshot state
        const previousState = getConfigQuery.getData();
        // Optimistic update
        getConfigQuery.setData(undefined, (state) => ({
          flags: { ...state?.flags, [flag]: value },
          numericOptions: { ...state?.numericOptions },
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
        // Get latest remoteState
        getConfigQuery.invalidate();
      },
    });

  const remoteState = remoteConfig?.flags[remoteFlag];
  const remoteStateExists = typeof remoteState === "boolean";
  const checked = remoteState ?? false;

  return (
    <Switch
      checked={checked}
      onChange={(e) => {
        const newState = e.currentTarget.checked;
        changeRemoteState({ flag: remoteFlag, value: newState });
      }}
      label={label ?? `Włącz ${remoteFlag}`}
      error={!remoteStateExists && "Flaga nie istnieje w bazie danych"}
      {...otherProps}
    />
  );
};
