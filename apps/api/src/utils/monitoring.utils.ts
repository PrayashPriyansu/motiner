/**
 * Shared monitoring utilities to eliminate code duplication
 */

import { db, pings, siteStats } from '@repo/database'
import { eq, and, avg, count, sql } from 'drizzle-orm'

/**
 * Check if a website is up and return status information
 */
export async function checkWebsiteStatus(url: string) {
  const startTime = performance.now()

  try {
    // Create timeout controller (10 seconds)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    // Make HTTP request to the website
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Website-Monitor/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    clearTimeout(timeoutId)
    const responseTime = Math.round(performance.now() - startTime)

    // Check if status code indicates the site is up (2xx or 3xx)
    const isUp = response.status >= 200 && response.status < 400

    return {
      status: isUp ? 'up' as const : 'down' as const,
      statusCode: response.status,
      responseTime,
      error: isUp ? undefined : `HTTP ${response.status}`,
    }

  } catch (error) {
    const responseTime = Math.round(performance.now() - startTime)
    let errorMessage = 'Unknown error'

    // Categorize different types of errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout (10s)'
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'DNS resolution failed'
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused'
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error'
      } else {
        errorMessage = error.message
      }
    }

    return {
      status: 'down' as const,
      statusCode: undefined,
      responseTime,
      error: errorMessage,
    }
  }
}

/**
 * Calculate comprehensive site statistics
 */
export async function calculateSiteStats(siteId: string) {
  // Get total pings for this site
  const totalPings = await db
    .select({ count: count() })
    .from(pings)
    .where(eq(pings.siteId, siteId))

  // Get successful pings for this site
  const successfulPings = await db
    .select({ count: count() })
    .from(pings)
    .where(and(
      eq(pings.siteId, siteId),
      eq(pings.isUp, true)
    ))

  // Calculate uptime percentage
  const total = totalPings[0]?.count || 0
  const successful = successfulPings[0]?.count || 0
  const uptimePercentage = total > 0 ? (successful / total) * 100 : 0

  // Calculate average response time for successful pings only
  const avgResponseResult = await db
    .select({ avg: avg(pings.responseTime) })
    .from(pings)
    .where(and(
      eq(pings.siteId, siteId),
      eq(pings.isUp, true),
      sql`${pings.responseTime} IS NOT NULL`
    ))

  const avgResponseTime = Math.round(Number(avgResponseResult[0]?.avg) || 0)

  // Return calculated all-time stats
  return {
    uptime1h: uptimePercentage,
    uptime24h: uptimePercentage,
    uptime7d: uptimePercentage,
    avgResponseTime1h: avgResponseTime,
    avgResponseTime24h: avgResponseTime,
    avgResponseTime7d: avgResponseTime,
    uptimeAllTime: uptimePercentage,
    avgResponseTimeAllTime: avgResponseTime,
  }
}

/**
 * Update site statistics after a ping
 */
export async function updateSiteStats(siteId: string, pingResult: any, checkedAt: Date) {
  try {
    console.log(`🔄 Starting site stats calculation for site ${siteId}`)
    const calculatedStats = await calculateSiteStats(siteId)

    await db.insert(siteStats).values({
      siteId,
      currentStatus: pingResult.status === 'up' ? 'up' : 'down',
      lastChecked: checkedAt,
      ...calculatedStats,
    }).onConflictDoUpdate({
      target: siteStats.siteId,
      set: {
        currentStatus: pingResult.status === 'up' ? 'up' : 'down',
        lastChecked: checkedAt,
        updatedAt: new Date(),
        ...calculatedStats,
      }
    })

    console.log(`📈 Successfully updated site stats for site ${siteId}`)
  } catch (statsError) {
    console.error('🚨 Failed to update site stats:', statsError)
    throw statsError
  }
}