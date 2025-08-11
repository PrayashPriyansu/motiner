// Core monitoring types and interfaces

export interface PingResult {
  siteId: string
  isUp: boolean
  responseTime?: number // in milliseconds
  statusCode?: number // HTTP status code
  error?: string // error message if ping failed
  checkedAt: Date
  location: string // monitoring location (e.g., "Singapore")
  regionCode: string // region code (e.g., "SG")
}

export interface SiteStats {
  uptime1h: number // uptime percentage over last 1 hour
  uptime24h: number // uptime percentage over last 24 hours
  uptime7d: number // uptime percentage over last 7 days
  avgResponseTime1h: number // average response time over last 1 hour
  avgResponseTime24h: number // average response time over last 24 hours
  avgResponseTime7d: number // average response time over last 7 days
  lastChecked: Date // timestamp of last check
  currentStatus: 'up' | 'down' // current site status
}

export interface RollingStats {
  period: TimePeriod
  uptimePercentage: number
  averageResponseTime: number
  totalChecks: number
  successfulChecks: number
  calculatedAt: Date
}

export type TimePeriod = '1h' | '24h' | '7d'

export interface MonitoringConfig {
  intervalMs: number // monitoring interval in milliseconds
  timeoutMs: number // ping timeout in milliseconds
  location: string // monitoring location
  regionCode: string // monitoring region code
  maxConcurrentPings: number // max concurrent pings
  dbRetryAttempts: number // database retry attempts
  dbRetryDelayMs: number // database retry delay in milliseconds
}

export interface PingOptions {
  timeout: number // request timeout in milliseconds
  userAgent?: string // custom user agent
  followRedirects?: boolean // whether to follow redirects
}

// Error types for categorizing ping failures
export type PingErrorType = 
  | 'DNS_FAILURE'
  | 'CORS_ERROR' 
  | 'TIMEOUT_ERROR'
  | 'CONNECTION_REFUSED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export interface PingError {
  type: PingErrorType
  message: string
  originalError?: Error
}

// Service interfaces
export interface BackgroundJobManager {
  start(): Promise<void>
  stop(): Promise<void>
  isRunning(): boolean
}

export interface SiteMonitorService {
  runMonitoringCycle(): Promise<void>
  pingAllSites(): Promise<PingResult[]>
}

export interface HttpClientService {
  pingSite(url: string, options: PingOptions): Promise<PingResult>
}

export interface DatabaseService {
  getActiveSites(): Promise<Array<{ id: string; url: string; name: string }>>
  insertPing(ping: Omit<PingResult, 'siteId'> & { siteId: string }): Promise<void>
  insertPings(pings: Array<Omit<PingResult, 'siteId'> & { siteId: string }>): Promise<void>
  // Site stats operations
  upsertSiteStats(siteId: string, stats: SiteStats): Promise<void>
  getSiteStats(siteId: string): Promise<SiteStats | null>
  getAllSiteStats(): Promise<Array<SiteStats & { siteId: string }>>
  // Additional methods for statistics calculation
  getRecentPings(siteId: string, limit?: number): Promise<PingResult[]>
  getPingStats(siteId: string, hoursBack: number): Promise<{
    totalPings: number
    successfulPings: number
    averageResponseTime: number
    uptimePercentage: number
  }>
  getActiveSiteCount(): Promise<number>
  healthCheck(): Promise<boolean>
}

export interface AggregateStatsService {
  updateSiteStats(siteId: string, pingResult: PingResult): Promise<void>
  getSiteStats(siteId: string): Promise<SiteStats | null>
  getAllSiteStats(): Promise<Array<SiteStats & { siteId: string }>>
  calculateRollingStats(siteId: string, period: TimePeriod): Promise<RollingStats>
}