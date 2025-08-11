"use client"

import { MetricCard } from '../ui/metric-card'
import { DashboardMetrics } from 'web/lib/types'
import { formatResponseTime, formatNumber } from 'web/lib/utils'
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Clock 
} from 'lucide-react'

interface OverviewCardsProps {
  metrics: DashboardMetrics
}

export function OverviewCards({ metrics }: OverviewCardsProps) {
  // Determine uptime trend and color
  const getUptimeTrend = (uptime: number) => {
    if (uptime >= 99.5) return { trend: 'up' as const, subtitle: 'Excellent uptime' }
    if (uptime >= 95) return { trend: 'neutral' as const, subtitle: 'Good uptime' }
    return { trend: 'down' as const, subtitle: 'Needs attention' }
  }

  // Determine incidents trend
  const getIncidentsTrend = (incidents: number) => {
    if (incidents === 0) return { trend: 'up' as const, subtitle: 'No incidents' }
    if (incidents <= 2) return { trend: 'neutral' as const, subtitle: 'Few incidents' }
    return { trend: 'down' as const, subtitle: 'Multiple incidents' }
  }

  // Determine response time trend
  const getResponseTimeTrend = (responseTime: number) => {
    if (responseTime <= 200) return { trend: 'up' as const, subtitle: 'Fast response' }
    if (responseTime <= 500) return { trend: 'neutral' as const, subtitle: 'Good response' }
    return { trend: 'down' as const, subtitle: 'Slow response' }
  }

  const uptimeTrend = getUptimeTrend(metrics.uptime24h)
  const incidentsTrend = getIncidentsTrend(metrics.downtimeIncidents7d)
  const responseTimeTrend = getResponseTimeTrend(metrics.avgResponseTime)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Monitors */}
      <MetricCard
        title="Total Monitors"
        value={formatNumber(metrics.totalMonitors)}
        icon={<Activity className="h-4 w-4" />}
        subtitle="Active monitors"
      />

      {/* Uptime Percentage */}
      <MetricCard
        title="Uptime (Last 24h)"
        value={`${metrics.uptime24h.toFixed(2)}%`}
        icon={<TrendingUp className="h-4 w-4" />}
        trend={uptimeTrend.trend}
        subtitle={uptimeTrend.subtitle}
      />

      {/* Downtime Incidents */}
      <MetricCard
        title="Downtime Incidents (Last 7 days)"
        value={formatNumber(metrics.downtimeIncidents7d)}
        icon={<AlertTriangle className="h-4 w-4" />}
        trend={incidentsTrend.trend}
        subtitle={incidentsTrend.subtitle}
      />

      {/* Average Response Time */}
      <MetricCard
        title="Average Response Time"
        value={formatResponseTime(metrics.avgResponseTime)}
        icon={<Clock className="h-4 w-4" />}
        trend={responseTimeTrend.trend}
        subtitle={responseTimeTrend.subtitle}
      />
    </div>
  )
}