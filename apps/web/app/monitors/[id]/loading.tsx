export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-96 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-full w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Main Grid Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Bar Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 h-64 animate-pulse">
              <div className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-10 gap-1 h-32">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-sm animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Stats Card Skeleton */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 h-64 animate-pulse">
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}