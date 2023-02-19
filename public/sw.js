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
 * @property {string} [path]
 */

/**
 * @description Show received push notification
 * @argument {NotificationPayload} payload
 */
const displayNotification = async (payload) => {
  if (!(_self.Notification && _self.Notification.permission === "granted"))
    return;

  const { title, timestamp, body, path } = payload;

  const _title = title ?? "Bez tytułu";

  await _self.registration.showNotification(_title, {
    body,
    timestamp,
    icon: "/favicon.ico",
    // "Arbitrary data that you want to be associated with the notification. This can be of any data type." ~MDN
    data: {
      path,
    },
  });
};

/**
 * @description Try to focus/open provided path
 * @argument {string} [path]
 */
const focusOnUrl = async (path) => {
  if (!path) return;

  await _self.clients.matchAll({ type: "window" }).then((clientsArray) => {
    // Focus on a matching tab
    const hadWindowToFocus = clientsArray.some((windowClient) => {
      if (windowClient.url === `${_self.location.origin}${path}`) {
        windowClient.focus();
        return true;
      }
      return false;
    });
    // Otherwise, open a new tab and focus
    if (!hadWindowToFocus)
      _self.clients
        .openWindow(path)
        .then((windowClient) => windowClient?.focus());
  });
};

// Wait for Promise to settle
_self.addEventListener("push", function (event) {
  const data = event.data?.json() ?? {};
  const displayNotificationPromise = displayNotification(data);
  event.waitUntil(Promise.all([displayNotificationPromise]));
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

// Handle notification click
_self.addEventListener("notificationclick", function (event) {
  // Close notification
  event.notification.close();
  // Try to focus on URL
  const path = event.notification.data.path;
  const focusOnUrlPromise = focusOnUrl(path);
  event.waitUntil(Promise.all([focusOnUrlPromise]));
});
