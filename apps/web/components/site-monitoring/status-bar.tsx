import { CircleCheck, LucideIcon, RefreshCcw, TriangleAlertIcon } from 'lucide-react';
import React from 'react';

export default function StatusBar({ status }: { status: string }) {
    const statusConfig: Record<string, {
        bgClass: string;
        textClass: string;
        iconClass: string;
        icon: LucideIcon;
        message: string;
        pulse?: string;
    }> = {
        up: {
            bgClass: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
            textClass: 'text-green-800 dark:text-green-300',
            iconClass: 'text-green-600 dark:text-green-400',
            icon: CircleCheck,
            message: 'All systems operational',
            pulse: 'animate-pulse'
        },
        down: {
            bgClass: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
            textClass: 'text-red-800 dark:text-red-300',
            iconClass: 'text-red-600 dark:text-red-400',
            icon: TriangleAlertIcon,
            message: 'Some systems down',
            pulse: 'animate-pulse'
        },
        checking: {
            bgClass: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30',
            textClass: 'text-yellow-800 dark:text-yellow-300',
            iconClass: 'text-yellow-600 dark:text-yellow-400',
            icon: TriangleAlertIcon,
            message: 'Checking status',
            pulse: 'animate-spin'
        }
    };

    const config = statusConfig[status] || statusConfig.checking;
    const IconComponent = config.icon;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden h-full">
            <div className={`${config.bgClass} border-b border-gray-200/50 dark:border-gray-700/50`}>
                <div className="flex items-center justify-center gap-3 p-6">
                    <IconComponent className={`w-6 h-6 ${config.iconClass} ${status === 'checking' ? config.pulse : ''}`} />
                    <span className={`text-lg font-semibold ${config.textClass}`}>
                        {config.message}
                    </span>
                </div>
            </div>

            {/* Grid visualization area */}
            <div className="p-6 h-full bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-gray-900/50 dark:to-gray-800/30">
                <div className="grid grid-cols-10 gap-1 h-32 opacity-20">
                    {Array.from({ length: 10 }, (_, i) => (
                        <div
                            key={i}
                            className={`rounded-sm ${Math.random() > 0.7
                                ? 'bg-green-400 dark:bg-green-500'
                                : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center gap-3">
                    <p>
                        Last 10 pings
                    </p>
                    <div className='flex items-center gap-2'>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Last checked: {new Date().toLocaleTimeString()}
                        </span>
                    <RefreshCcw className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200 cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
}



{/* {Array.from({ length: 144 }, (_, i) => (
            <div
              key={i}
              className={`rounded-sm ${
                Math.random() > 0.7 
                  ? 'bg-green-400 dark:bg-green-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))} */}