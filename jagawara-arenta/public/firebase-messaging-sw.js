importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDOkcTideSN4lTS5V31c57v7_bVzZ_aQxQ",
  authDomain: "web-jagawara-arenta-26.firebaseapp.com",
  projectId: "web-jagawara-arenta-26",
  storageBucket: "web-jagawara-arenta-26.firebasestorage.app",
  messagingSenderId: "73580441803",
  appId: "1:73580441803:web:215a2b2b3e9196018bab4e"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Pesan darurat diterima: ', payload);

  const notificationTitle = payload.notification.title || 'Peringatan EWS';
  const notificationOptions = {
    body: payload.notification.body || 'Silakan cek aplikasi segera.',
    icon: '/icon.svg', 
    badge: '/icon.svg',
    vibrate: [2000, 500, 2000],
    data: payload.data,
    
    actions: [
      { action: 'open_app', title: 'Buka Aplikasi' },
      { action: 'mute_siren', title: '🔕 Matikan Sirine' }
    ]
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'mute_siren') {
      console.log('Warga menekan tombol Matikan Sirine');
  } else {
      event.waitUntil(
          clients.matchAll({ type: 'window' }).then((windowClients) => {
              for (let i = 0; i < windowClients.length; i++) {
                  let client = windowClients[i];
                  if (client.url.includes('/') && 'focus' in client) {
                      return client.focus();
                  }
              }
              if (clients.openWindow) {
                  return clients.openWindow('/');
              }
          })
      );
  }
});