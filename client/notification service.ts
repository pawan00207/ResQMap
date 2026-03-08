export class NotificationService {
  static async subscribe() {
    if (!('serviceWorker' in navigator)) return
    
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
    })
    
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription)
    })
  }

  static async updatePreferences(prefs) {
    await fetch('/api/notifications/preferences', {
      method: 'PATCH',
      body: JSON.stringify(prefs)
    })
  }
}
