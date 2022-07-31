import { Check, X } from "tabler-icons-react";
import { TRPCClientError } from "@trpc/client";
import { useId } from "@mantine/hooks";
import { UseTRPCMutationOptions } from "@trpc/react";
import {
  hideNotification,
  showNotification,
  updateNotification,
} from "@mantine/notifications";

interface UseStatusNotificationOptions {
  mutatingMessage?: string;
  successMessage?: string;
  failureMessage?: string;
}

/**
 * Easy way to display status
 */
const useStatusNotification = (options?: UseStatusNotificationOptions) => {
  const id = useId(); // NOTIFICATION_ID

  const { mutatingMessage, successMessage, failureMessage } = options ?? {};

  const showMutating = (message?: string) => {
    hideNotification(id);
    showNotification({
      id,
      color: "blue",
      title: "Zapisywanie zmian",
      message:
        message ??
        mutatingMessage ??
        "Oczekiwanie na potwierdzenie ze strony serwera",
      loading: true,
      autoClose: false,
      disallowClose: true,
    });
  };

  const showSuccess = (message?: string) => {
    updateNotification({
      id,
      title: "Zmiany zostały zapisane",
      message: message ?? successMessage,
      color: "green",
      icon: Check({}), // It has to be called like that in order to work here
      loading: false,
      autoClose: 2000,
      disallowClose: false,
    });
  };

  const showFailure = (message?: string) => {
    updateNotification({
      id,
      title: "Coś poszło nie tak",
      message: message ?? failureMessage,
      color: "red",
      icon: X({}),
      loading: false,
      autoClose: 8000,
      disallowClose: false,
    });
  };

  return { showMutating, showSuccess, showFailure };
};

interface UseMutationStatusNotification extends UseStatusNotificationOptions {
  onMutate?: () => void;
  onSuccess?: () => void;
  onError?: ({ message }: TRPCClientError<any>) => void;
}

/**
 * Easier way to setup mutation status notifications with trpc.useMutation
 * NOTE: Functions passed to useMutationStatusNotification are executed after original functions
 * @example const opts = useMutationStatusNotification();
 * const { mutateAsync } = trpc.useMutation("mutation", {...opts})
 */
const useMutationStatusNotification = (
  options?: UseMutationStatusNotification
) => {
  const {
    onError: onErrorExtra,
    onMutate: onMutateExtra,
    onSuccess: onSuccessExtra,
    ...rest
  } = options ?? {};

  const { showMutating, showSuccess, showFailure } =
    useStatusNotification(rest);

  const onMutate = () => {
    showMutating();
    if (!onMutateExtra) return;
    onMutateExtra();
  };

  const onSuccess = () => {
    showSuccess();
    if (!onSuccessExtra) return;
    onSuccessExtra();
  };

  const onError = (err: TRPCClientError<any>) => {
    const parsedMessage: TRPCClientError<any>[] = JSON.parse(err.message);
    const messageToDisplay = parsedMessage?.[0]?.message;
    showFailure(messageToDisplay);
    if (!onErrorExtra) return;
    onErrorExtra(err);
  };

  return {
    onMutate,
    onSuccess,
    onError,
    useErrorBoundary: false, // Required to display nice errors instead of crashing
  } as Pick<
    UseTRPCMutationOptions<any, any, any>,
    "useErrorBoundary" | "onMutate" | "onSuccess" | "onError"
  >;
};

export { useStatusNotification, useMutationStatusNotification };
