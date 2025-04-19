"use client"

import { useOnlineStatus } from '@/contexts/OnlineStatusProvider'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'

export function useSyncOnlineStatus() {
  const { isOnline, isPageVisible } = useOnlineStatus()
  const { userId } = useAuth()

  useEffect(() => {
    if (!userId) return

    const syncStatus = async () => {
      const actualStatus = isOnline && isPageVisible

      try {
        await fetch('/api/user/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: actualStatus, userId }),
          keepalive: true // Para garantir que a requisição seja enviada mesmo se a aba for fechada
        })
      } catch (error) {
        console.error('Sync failed:', error)
      }
    }

    syncStatus()

    const interval = setInterval(syncStatus, 30000) // A cada 30 segundos

    return () => clearInterval(interval)
  }, [isOnline, isPageVisible, userId])
}