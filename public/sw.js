// Licensed under the Open Software License version 3.0
/// <reference lib="WebWorker" />

/**
 * @type {ServiceWorkerGlobalScope}
 */
const _self = self;

/**
 * @typedef NotificationPayload
 * @type {object}
 * @property {string} title
 * @property {string} [body]
 * @property {number} [timestamp]
 */

/**
 * @description Show received push notification
 * @argument {NotificationPayload} payload
 */
const displayNotification = async (payload) => {
  if (!(_self.Notification && _self.Notification.permission === "granted"))
    return;

  const { title, timestamp, body } = payload;

  const _title = title ?? "Bez tytułu";

  await _self.registration.showNotification(_title, {
    body,
    timestamp,
    icon: "/favicon.ico",
  });
};

// Wait for Promise to settle
_self.addEventListener("push", function (event) {
  const data = event.data?.json() ?? {};
  const displayPushPromise = displayNotification(data);
  event.waitUntil(displayPushPromise);
});

// Update subscription on the server
_self.addEventListener("pushsubscriptionchange", async function (event) {
  const { oldSubscription, newSubscription } = event;
  await fetch("/api/trpc/push.change", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oldSubscription, newSubscription }),
  });
});
