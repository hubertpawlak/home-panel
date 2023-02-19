// Licensed under the Open Software License version 3.0
import webPush from "web-push";

export function getVapidDetails() {
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC;
  const privateKey = process.env.VAPID_PRIVATE;
  if (!subject) throw new Error("Missing VAPID_SUBJECT");
  if (!publicKey) throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC");
  if (!privateKey) throw new Error("Missing VAPID_PRIVATE");
  return { subject, publicKey, privateKey };
}

interface FlatPushSubscription {
  endpoint: webPush.PushSubscription["endpoint"];
  p256dh: webPush.PushSubscription["keys"]["p256dh"];
  auth: webPush.PushSubscription["keys"]["auth"];
}

interface NotificationPayload {
  title: string;
  body?: string;
  timestamp?: number;
  path?: string;
}

/**
 * Wrapper for DRY purposes
 * @returns a webPush.sendNotification Promise to .catch errors
 */
export async function sendPush(
  subscription: FlatPushSubscription,
  payload: NotificationPayload,
  options?: webPush.RequestOptions
) {
  const vapidDetails = getVapidDetails();
  const _sub: webPush.PushSubscription = {
    endpoint: subscription.endpoint,
    keys: { p256dh: subscription.p256dh, auth: subscription.auth },
  };
  const _payload: string = JSON.stringify(payload);
  return webPush.sendNotification(_sub, _payload, {
    vapidDetails,
    ...options,
  });
}
