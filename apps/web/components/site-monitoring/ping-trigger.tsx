"use client"

import { RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PingTriggerProps {
  siteId: string
  className?: string
}

export default function PingTrigger({ siteId, className = "" }: PingTriggerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleTriggerPing = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/trigger-ping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteId }),
      })

      if (response.ok) {
        // Refresh the page to show updated data
        router.refresh()
      } else {
        console.error('Failed to trigger ping')
      }
    } catch (error) {
      console.error('Error triggering ping:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RefreshCcw 
      className={`w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200 cursor-pointer ${isLoading ? 'animate-spin' : ''} ${className}`}
      onClick={handleTriggerPing}
      title="Trigger manual ping"
    />
  )
}