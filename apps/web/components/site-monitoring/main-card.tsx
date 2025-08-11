import { Clock, Zap } from 'lucide-react';
import React from 'react';

export default function MainCard({ uptime, restime }: { uptime: string, restime: string, title?: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden h-full">

      <div className="h-full divide-y divide-gray-200 dark:divide-gray-700 grid grid-rows-2">
        {/* Uptime Section */}
        <div className="p-6 row-span-1 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Uptime
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Last 30 days
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono text-gray-900 dark:text-gray-100">
                {uptime}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                ↗ Excellent
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Section */}
        <div className="p-6 row-span-1 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Response
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Last hour
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono text-gray-900 dark:text-gray-100">
                {restime}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                ↗ Fast
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
