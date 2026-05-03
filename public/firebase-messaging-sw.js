// Firebase Cloud Messaging Service Worker
// Este archivo debe estar en /public para que esté accesible en la raíz del sitio

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Firebase
// Puedes obtenerlos desde Firebase Console → Configuración del proyecto
firebase.initializeApp({
  apiKey: self.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
  authDomain: self.FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: self.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: self.FIREBASE_APP_ID || 'YOUR_APP_ID',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[FCM] Mensaje en background:', payload);

  const notificationTitle = payload.notification?.title || '📦 VAPE DROP — Nuevo pedido';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes un nuevo pedido.',
    icon: '/logo_vapedrop.png',
    badge: '/logo_vapedrop.png',
    data: payload.data,
    actions: [
      { action: 'open', title: 'Ver pedido' },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/admin')
    );
  }
});
