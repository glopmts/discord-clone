"use client"

import { createContext, useContext, useEffect, useState } from 'react'

type OnlineStatusContextType = {
  isOnline: boolean
  isPageVisible: boolean
}

const OnlineStatusContext = createContext<OnlineStatusContextType>({
  isOnline: true,
  isPageVisible: true
})

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isPageVisible, setIsPageVisible] = useState(true)

  useEffect(() => {
    // Controle de conectividade (online/offline)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    setIsOnline(navigator.onLine)

    // Controle de visibilidade da página (aba ativa/oculta)
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    setIsPageVisible(!document.hidden)

    const handleBeforeUnload = () => {
      navigator.sendBeacon('/api/user/update-status', JSON.stringify({
        status: false,
        timestamp: Date.now()
      }))
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <OnlineStatusContext.Provider value={{ isOnline, isPageVisible }}>
      {children}
    </OnlineStatusContext.Provider>
  )
}

export const useOnlineStatus = () => useContext(OnlineStatusContext)