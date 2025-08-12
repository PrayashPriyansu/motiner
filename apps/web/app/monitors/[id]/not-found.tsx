import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Monitor Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The monitor you're looking for doesn't exist or has been removed.
          </p>
        </div>
        
        <Link 
          href="/monitors"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Monitors
        </Link>
      </div>
    </div>
  )
}