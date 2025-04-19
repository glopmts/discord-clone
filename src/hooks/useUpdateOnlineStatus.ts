"use client"

import { updateOnlineStatus } from '@/app/actions/user'
import { useOnlineStatus } from '@/contexts/OnlineStatusProvider'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'

export function useUpdateOnlineStatus() {
  const { isOnline } = useOnlineStatus()
  const { userId } = useAuth()

  useEffect(() => {
    if (!userId) return

    const updateStatus = async () => {
      try {
        await updateOnlineStatus(userId, isOnline)
      } catch (error) {
        console.error('Failed to update online status:', error)
      }
    }

    updateStatus()
  }, [isOnline, userId])
}