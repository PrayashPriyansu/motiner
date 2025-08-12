import { Clock, Zap, TrendingUp, Activity } from 'lucide-react';
import React from 'react';

interface SiteStats {
  totalChecks: number
  successfulChecks: number
  uptime1h: number
  uptime24h: number
  uptime7d: number
  avgResponseTime1h: number
  avgResponseTime24h: number
  avgResponseTime7d: number
  uptimeAllTime: number
  avgResponseTimeAllTime: number
  currentStatus: 'up' | 'down'
  lastChecked: string
}

interface MainCardProps {
  uptime: string
  restime: string
  title?: string
  stats?: SiteStats
}

export default function MainCard({ uptime, restime, title, stats }: MainCardProps) {
  const getUptimeStatus = (uptime: number) => {
    if (uptime >= 99.9) return { text: 'Excellent', color: 'text-green-600 dark:text-green-400' }
    if (uptime >= 99.0) return { text: 'Good', color: 'text-blue-600 dark:text-blue-400' }
    if (uptime >= 95.0) return { text: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' }
    return { text: 'Poor', color: 'text-red-600 dark:text-red-400' }
  }

  const getResponseTimeStatus = (responseTime: number) => {
    if (responseTime <= 200) return { text: 'Excellent', color: 'text-green-600 dark:text-green-400' }
    if (responseTime <= 500) return { text: 'Good', color: 'text-blue-600 dark:text-blue-400' }
    if (responseTime <= 1000) return { text: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' }
    return { text: 'Slow', color: 'text-red-600 dark:text-red-400' }
  }

  const uptimeValue = parseFloat(uptime.replace('%', ''))
  const responseTimeValue = parseInt(restime.replace('ms', ''))
  const uptimeStatus = getUptimeStatus(uptimeValue)
  const responseTimeStatus = getResponseTimeStatus(responseTimeValue)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden h-full">
      <div className="h-full divide-y divide-gray-200 dark:divide-gray-700 grid grid-rows-4">
        {/* Uptime Section */}
        <div className="p-4 row-span-1 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Uptime (24h)
                </h4>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">
                {uptime}
              </div>
              <div className={`text-xs font-medium ${uptimeStatus.color}`}>
                {uptimeStatus.text}
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Section */}
        <div className="p-4 row-span-1 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Response (24h)
                </h4>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">
                {restime}
              </div>
              <div className={`text-xs font-medium ${responseTimeStatus.color}`}>
                {responseTimeStatus.text}
              </div>
            </div>
          </div>
        </div>

        {/* All-time Uptime */}
        {stats && (
          <div className="p-4 row-span-1 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    All-time Uptime
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">
                  {stats.uptimeAllTime.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stats.successfulChecks}/{stats.totalChecks} checks
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Total Checks */}
        {stats && (
          <div className="p-4 row-span-1 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Checks
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-gray-900 dark:text-gray-100">
                  {stats.totalChecks}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {((stats.successfulChecks / stats.totalChecks) * 100).toFixed(1)}% success
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
