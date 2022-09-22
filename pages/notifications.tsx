import Layout from "../components/Layout";
import { Bell } from "tabler-icons-react";
import {
  Button,
  Checkbox,
  Container,
  Stack,
  Text,
  Title
  } from "@mantine/core";
import { NextPageWithLayout } from "./_app";
import { rolePower } from "../types/RolePower";
import { trpc } from "../utils/trpc";
import { useCallback, useEffect, useState } from "react";
import { useInterval } from "@mantine/hooks";
import { useMutationStatusNotification } from "../utils/notifications";

async function getSubscription() {
  const perm = await Notification.requestPermission(); // Triggers UI on "default"
  if (perm !== "granted") return;
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC,
  });
  if (!sub) return;
  return sub;
}

const NotificationsPage: NextPageWithLayout = () => {
  const applicationServerKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC;

  // Store everything inside state for client-side checks
  const [isTechSupported, setIsTechSupported] = useState(false);
  const [swState, setSwState] = useState<ServiceWorkerState>();
  const [notifyPerm, setNotifyPerm] =
    useState<NotificationPermission>("default");
  const [pushPerm, setPushPerm] = useState<PermissionState>();
  const [subscription, setSubscription] = useState<boolean>(false);

  // Prepare a function to update state
  const checkState = useCallback(async () => {
    setSwState(navigator.serviceWorker.controller?.state);
    setNotifyPerm(Notification.permission);
    const registration = await navigator.serviceWorker.getRegistration();
    const _permState = await registration?.pushManager.permissionState({
      userVisibleOnly: true,
      applicationServerKey,
    });
    setPushPerm(_permState);
    const _subscription = await registration?.pushManager.getSubscription();
    setSubscription(!!_subscription);
  }, [
    applicationServerKey,
    setSwState,
    setNotifyPerm,
    setPushPerm,
    setSubscription,
  ]);

  // Check notification state in case the user changes browser settings
  const checker = useInterval(() => {
    checkState();
  }, 3000);

  // Execute checks on supported clients
  useEffect(() => {
    const isSupported =
      "window" in globalThis &&
      "navigator" in globalThis &&
      "serviceWorker" in navigator &&
      "Notification" in window;
    if (applicationServerKey && isSupported) {
      setIsTechSupported(isSupported);
      checker.start();
      checkState();
    }
    return checker.stop();
  }, [checkState, applicationServerKey, checker]);

  const opts = useMutationStatusNotification();
  // Prepare mutations to update subscription on the server
  const { mutateAsync: registerSub, isLoading: isLoadingPR } = trpc.useMutation(
    "push.register",
    opts
  );
  const { mutateAsync: changeSub, isLoading: isLoadingPC } = trpc.useMutation(
    "push.change",
    opts
  );

  if (!applicationServerKey)
    return <Text color="red">missing applicationServerKey</Text>;

  return (
    <Container size="xl">
      <Stack spacing="xs">
        <Title align="center">Zarządzanie powiadomieniami</Title>
        <Button.Group>
          <Button
            fullWidth
            color="green"
            disabled={
              !isTechSupported || isLoadingPC || isLoadingPR || subscription
            }
            onClick={async () => {
              const sub = await getSubscription();
              if (!sub) return;
              const json = sub.toJSON();
              if (!json) return;
              const { endpoint, keys } = json;
              if (!endpoint || !keys) return;
              await registerSub({
                endpoint,
                keys: { p256dh: keys.p256dh, auth: keys.auth },
              }).catch(() => {});
            }}
          >
            Subskrybuj
          </Button>
          <Button
            fullWidth
            color="red"
            disabled={
              !isTechSupported || isLoadingPC || isLoadingPR || !subscription
            }
            onClick={async () => {
              const sub = await getSubscription();
              if (!sub) return;
              const json = sub.toJSON();
              if (!json) return;
              const { endpoint, keys } = json;
              if (!endpoint || !keys) return;
              await changeSub({
                oldSubscription: {
                  endpoint,
                  keys: { p256dh: keys.p256dh, auth: keys.auth },
                },
                newSubscription: null,
              }).catch(() => {});
              sub.unsubscribe();
            }}
          >
            Anuluj subskrypcję
          </Button>
        </Button.Group>
        <Title align="center">Czy wszystko działa?</Title>
        <Checkbox
          readOnly
          color="green"
          checked={isTechSupported}
          label="Twoja przeglądarka obsługuje powiadomienia"
        />
        <Checkbox
          readOnly
          color="green"
          checked={swState === "activated"}
          label="ServiceWorker jest aktywny"
        />
        <Checkbox
          readOnly
          color="green"
          checked={notifyPerm === "granted"}
          label="Uprawnienie do wyświetlania powiadomień zostało przyznane"
        />
        <Checkbox
          readOnly
          color="green"
          checked={pushPerm === "granted"}
          label="Uprawnienie do otrzymywania powiadomień zostało przyznane"
        />
        <Checkbox
          readOnly
          color="green"
          checked={subscription}
          label="Istnieje aktywna subskrypcja"
        />
      </Stack>
    </Container>
  );
};

NotificationsPage.getLayout = (page) => (
  <Layout
    title="Powiadomienia"
    icon={<Bell />}
    requiredPower={rolePower["user"]}
  >
    {page}
  </Layout>
);

export default NotificationsPage;
