
import { checkUsernameExists } from '@/app/actions/auth'
import { useEffect, useState } from 'react'

export function useUsernameCheck(initialUsername = '') {
  const [username, setUsername] = useState(initialUsername)
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [debouncedUsername, setDebouncedUsername] = useState(initialUsername)

  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null)
      return
    }

    const handler = setTimeout(() => {
      setDebouncedUsername(username)
    }, 500)

    return () => clearTimeout(handler)
  }, [username])

  useEffect(() => {
    if (debouncedUsername.length < 3) return

    const checkAvailability = async () => {
      setIsChecking(true)
      try {
        const exists = await checkUsernameExists(debouncedUsername)
        setIsAvailable(!exists)
      } catch (error) {
        console.error('Failed to check username:', error)
        setIsAvailable(null)
      } finally {
        setIsChecking(false)
      }
    }

    checkAvailability()
  }, [debouncedUsername])

  return {
    username,
    setUsername,
    isChecking,
    isAvailable,
    isValid: username.length >= 3
  }
}