// Licensed under the Open Software License version 3.0
import webPush from "web-push";
import { redis } from "./redis";
import supabase from "./supabase";

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

export interface NotificationPayload {
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

export async function sendPushToAll(
  subscriptions: FlatPushSubscription[],
  payload: NotificationPayload,
  options?: webPush.RequestOptions
) {
  return Promise.all(
    subscriptions.map((sub) =>
      // Send push notification
      // Delete subscription if it fails
      sendPush(sub, payload, options).catch(deleteSubscription(sub.endpoint))
    )
  );
}

export async function getAllPushSubscriptions() {
  const { data: subscriptions } = await supabase
    .from("push")
    .select("endpoint,p256dh,auth");
  return subscriptions ?? [];
}

export async function shouldPushBeSent() {
  // Get previous state and bump in one request
  const pushAlreadySent = await redis.set<boolean>("notified", true, {
    ex: 60, // Prevent spam for 60 seconds from last sensors update
    get: true, // Get previous state or null
  });
  if (pushAlreadySent === true) return false;
  return true;
}

export const deleteSubscription = (endpoint: string) => {
  return async () =>
    await supabase.from("push").delete().eq("endpoint", endpoint);
};

export async function autoSendPushToAll(
  payload: NotificationPayload,
  options?: webPush.RequestOptions
) {
  // Check if push was already sent
  const shouldSend = await shouldPushBeSent();
  if (!shouldSend) return;
  // Get subscriptions
  const subscriptions = await getAllPushSubscriptions();
  // Send push notifications to all subscriptions
  return sendPushToAll(subscriptions, payload, options);
}
