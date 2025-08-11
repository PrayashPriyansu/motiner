/**
 * Simple monitoring types for website checking and ping operations
 */

export interface WebsiteCheckResult {
  status: 'up' | 'down'
  statusCode?: number
  responseTime: number
  error?: string
}

export interface PingRecord {
  id: string
  checkedAt: string
  isUp: boolean
  responseTime?: number
  statusCode?: number
  location?: string
  regionCode?: string
  error?: string
}