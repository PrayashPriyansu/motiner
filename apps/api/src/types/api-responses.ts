/**
 * Frontend-compatible Monitor response type
 * Matches the Monitor interface expected by the frontend
 */
export interface MonitorResponse {
  id: string
  name: string
  url: string
  status: 'up' | 'down'
  uptime24h: number
  avgResponseTime: number
  lastChecked: Date
  createdAt: Date
}