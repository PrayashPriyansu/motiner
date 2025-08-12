import "server-only"

export interface SiteWithStats {
  id: string
  name: string
  url: string
  slug: string
  status: 'active' | 'archive' | 'not_tracking' | 'delete'
  interval: string
  createdAt: string
  updatedAt: string
  siteStats?: {
    id: string
    siteId: string
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
    createdAt: string
    updatedAt: string
  }
}

export interface PingData {
  id: string
  checkedAt: string
  isUp: boolean
  responseTime?: number
  statusCode?: number
  location?: string
  regionCode?: string
  error?: string
}

export const getSiteById = async (id: string): Promise<SiteWithStats | null> => {
  try {
    const res = await fetch(`http://localhost:9999/sites/${id}`)
    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch site: ${res.status}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching site:', error)
    return null
  }
}

export const getSitePings = async (siteId: string, limit: number = 50, offset: number = 0): Promise<{
  siteId: string
  siteName: string
  pings: PingData[]
  totalCount: number
  timestamp: string
} | null> => {
  try {
    const res = await fetch(`http://localhost:9999/monitoring/sites/${siteId}/pings?limit=${limit}&offset=${offset}`)
    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch pings: ${res.status}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching pings:', error)
    return null
  }
}

export const triggerSitePing = async (siteId: string): Promise<boolean> => {
  try {
    const res = await fetch('http://localhost:9999/monitoring/check-site', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ siteId }),
    })
    return res.ok
  } catch (error) {
    console.error('Error triggering ping:', error)
    return false
  }
}