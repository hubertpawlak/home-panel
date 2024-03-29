// Licensed under the Open Software License version 3.0
import {
  Button,
  Checkbox,
  Container,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { IconBell } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";
import Layout from "../components/Layout";
import { rolePower } from "../types/RolePower";
import { useMutationStatusNotification } from "../utils/notifications";
import { trpc } from "../utils/trpc";
import type { NextPageWithLayout } from "./_app";

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
    const isSupported =
      "window" in globalThis &&
      "navigator" in globalThis &&
      "serviceWorker" in navigator &&
      "Notification" in window;
    setIsTechSupported(isSupported);
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
    setIsTechSupported,
  ]);

  // Check notification state in case the user changes browser settings
  const checker = useInterval(() => checkState(), 3000);

  // This is intended to start the interval only on mount and stop it on unmount
  useEffect(() => {
    checkState(); // Don't wait for the interval
    checker.start();
    return checker.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opts = useMutationStatusNotification();
  // Prepare mutations to update subscription on the server
  const { mutateAsync: registerSub, isLoading: isLoadingPR } =
    trpc.push.register.useMutation(opts);
  const { mutateAsync: changeSub, isLoading: isLoadingPC } =
    trpc.push.change.useMutation(opts);

  const { data: pushEdgeFlags } = trpc.edgeConfig.get.useQuery(
    ["pushTTLSeconds", "pushNotifyAbove"],
    {
      // Reduce the amount of queries
      staleTime: 60 * 1000, // 1 min
    }
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
              })
                .then(() => {
                  checkState();
                })
                .catch(() => {});
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
              })
                .then(() => {
                  checkState();
                })
                .catch(() => {});
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
        <Title align="center">Globalne ustawienia</Title>
        <NumberInput
          value={pushEdgeFlags?.pushNotifyAbove}
          disabled
          label="pushNotifyAbove"
          description={
            <Balancer>
              Próg temperaturowy w&nbsp;stopniach Celsjusza, po&nbsp;którego
              osiągnięciu przez&nbsp;dowolny czujnik, zostanie wysłane
              powiadomienie
            </Balancer>
          }
        />
        <NumberInput
          value={pushEdgeFlags?.pushTTLSeconds}
          disabled
          label="pushTTLSeconds"
          description={
            <Balancer>
              Czas w&nbsp;sekundach przed&nbsp;wysłaniem kolejnego
              powiadomienia, po&nbsp;spadku temperatury poniżej progu
              przez&nbsp;wszystkie czujniki
            </Balancer>
          }
        />
      </Stack>
    </Container>
  );
};

NotificationsPage.getLayout = (page) => (
  <Layout
    title="Powiadomienia"
    icon={<IconBell />}
    requiredPower={rolePower["user"]}
  >
    {page}
  </Layout>
);

export default NotificationsPage;
