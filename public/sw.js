/// <reference lib="WebWorker" />

/**
 * @type {ServiceWorkerGlobalScope}
 */
const s = self;

/**
 * @typedef NotificationPayload
 * @type {object}
 * @property {string} title
 * @property {string} [body]
 * @property {number} [timestamp]
 */

// Show received push notifications
s.addEventListener("push", function (event) {
  if (!(s.Notification?.permission === "granted")) return;
  try {
    /**
     * @type {NotificationPayload}
     */
    const data = event.data.json();
    const { title, timestamp, body } = data;
    s.registration.showNotification(title, {
      body,
      timestamp,
      icon: "/favicon.ico",
    });
  } catch (error) {
    console.error(error);
  }
});

// Update subscription on the server
s.addEventListener("pushsubscriptionchange", async function (event) {
  const { oldSubscription, newSubscription } = event;
  await fetch("/api/trpc/push.change", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oldSubscription, newSubscription }),
  });
});
