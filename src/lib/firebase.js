import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { supabase } from './supabase'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app, messaging

function isFirebaseConfigured() {
  return firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
}

if (isFirebaseConfigured()) {
  app = initializeApp(firebaseConfig)
  messaging = getMessaging(app)
}

export async function requestNotificationPermission() {
  if (!isFirebaseConfigured()) {
    console.info('[FCM] Firebase no configurado — omitiendo notificaciones push')
    return null
  }
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    })

    if (token) {
      // Save token to Supabase admin_devices table
      await supabase.from('admin_devices').upsert({ device_token: token }, { onConflict: 'device_token' })
      console.info('[FCM] Token registrado:', token.slice(0, 20) + '...')
    }
    return token
  } catch (err) {
    console.warn('[FCM] Error obteniendo token:', err.message)
    return null
  }
}

export function onForegroundMessage(callback) {
  if (!messaging) return () => {}
  return onMessage(messaging, callback)
}

export { messaging }
