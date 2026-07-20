self.addEventListener("push", (event) => {
  let data = { title: "افيكتو", body: "تحديث على دورك بقائمة الانتظار" };
  try {
    if (event.data) data = event.data.json();
  } catch {
    // keep default
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      dir: "rtl",
      lang: "ar",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes("/waitlist") && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("/waitlist");
    })
  );
});
