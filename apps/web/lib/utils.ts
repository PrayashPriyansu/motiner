import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format uptime percentage with proper styling
export function formatUptimePercentage(uptime: number): string {
  return `${uptime.toFixed(2)}%`;
}

// Format response time with units
export function formatResponseTime(responseTime: number): string {
  if (responseTime === 0) return 'N/A';
  if (responseTime < 1000) return `${responseTime}ms`;
  return `${(responseTime / 1000).toFixed(2)}s`;
}

// Get status color for badges and indicators
export function getStatusColor(status: 'up' | 'down'): string {
  return status === 'up' ? 'bg-green-500' : 'bg-red-500';
}

// Get uptime color based on percentage
export function getUptimeColor(uptime: number): string {
  if (uptime >= 99) return 'text-green-600 dark:text-green-400';
  if (uptime >= 95) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

// Format large numbers with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}