"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from 'web/components/theme-toggle'
import { AddMonitorForm } from 'web/components/monitors/add-monitor-form'
import { NewMonitor } from 'web/lib/types'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from 'web/components/ui/button'

export default function AddMonitorPage() {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)
  const [addedMonitor, setAddedMonitor] = useState<NewMonitor | null>(null)

  const handleSubmit = async (monitor: NewMonitor) => {
    try {

      const payload = {
        name: monitor.name,
        url: monitor.url,
        slug: monitor.slug,
        interval: monitor.checkInterval.toString(),         
        status: 'active'
      }

      console.log('Submitting monitor:', payload)

      // Simulate API call delay
      await fetch('http://localhost:9999/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      // Show success state
      setAddedMonitor(monitor)
      setIsSuccess(true)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error) {
      console.error('Failed to add monitor:', error)
      // In a real app, you'd show an error message
    }
  }

  const handleCancel = () => {
    router.push('/')
  }

  if (isSuccess && addedMonitor) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Add Monitor</h1>
              <p className="text-muted-foreground">Success!</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Success Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                Monitor Added Successfully!
              </h2>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base px-4">
                Your monitor &quot;{addedMonitor.name}&quot; has been added and will start checking &quot;{addedMonitor.url}&quot; every {addedMonitor.checkInterval} minute{addedMonitor.checkInterval !== 1 ? 's' : ''}.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <h3 className="font-semibold mb-2 text-center sm:text-left">Monitor Details:</h3>
              <div className="text-sm space-y-1">
                <p className="break-words"><span className="font-medium">Name:</span> {addedMonitor.name}</p>
                <p className="break-all"><span className="font-medium">URL:</span> {addedMonitor.url}</p>
                <p><span className="font-medium">Check Interval:</span> {addedMonitor.checkInterval} minute{addedMonitor.checkInterval !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard in a few seconds...
            </p>

            <Button onClick={() => router.push('/')} className="mt-4 w-full sm:w-auto">
              Go to Dashboard Now
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">Add Monitor</h1>
              <p className="text-muted-foreground text-sm hidden sm:block">Create a new uptime monitor</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AddMonitorForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </main>
    </div>
  )
}