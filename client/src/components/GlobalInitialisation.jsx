'use client'

import { useEffect } from 'react'
import { initializeAuth } from '@/lib/auth-utils'
import { initializeGlobalListeners } from '@/lib/db-init'
import { syncQueue } from '@/lib/offline-queue'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { Toaster } from 'react-hot-toast'

export function GlobalInitialization() {
  const isOnline = useOnlineStatus()

  useEffect(() => {
    // 1. Initialize Firebase Auth
    const unsubscribeAuth = initializeAuth()

    // 2. Initialize Firestore/RTDB listeners
    initializeGlobalListeners()

    // 3. Online sync
    if (isOnline) {
      syncQueue()
    }

    return () => {
      unsubscribeAuth()
    }
  }, [isOnline])

  return <Toaster position="top-right" />
}
