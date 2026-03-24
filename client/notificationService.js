// Subscribe for notifications
export async function subscribeUser() {
  // Check if service worker is supported
  if (!navigator.serviceWorker) {
    console.log("Service Worker not supported")
    return
  }

  try {
    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready

    // Subscribe user
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY
    })

    // Send subscription to backend
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription)
    })

    console.log("User subscribed successfully")
  } catch (error) {
    console.log("Error subscribing user:", error)
  }
}

// Update notification preferences
export async function updateUserPreferences(prefs) {
  try {
    await fetch('/api/notifications/preferences', {
      method: 'PATCH',
      body: JSON.stringify(prefs)
    })

    console.log("Preferences updated")
  } catch (error) {
    console.log("Error updating preferences:", error)
  }
}