import { notFound } from 'next/navigation'
import MainCard from "web/components/site-monitoring/main-card";
import StatusBar from "web/components/site-monitoring/status-bar";
import StatusChart from "web/components/site-monitoring/status-chart";
import { getSiteById, getSitePings } from "web/data/monitors/get-site";
import { Badge } from "web/components/ui/badge";
import { ExternalLink, Clock, Activity } from "lucide-react";
import Link from "next/link";

interface MonitorPageProps {
  params: {
    id: string
  }
}

export default async function MonitorPage({ params }: MonitorPageProps) {
  const site = await getSiteById(params.id)
  
  if (!site) {
    notFound()
  }

  const pingsData = await getSitePings(params.id, 50)
  const pings = pingsData?.pings || []

  // Calculate display values
  const uptime = site.siteStats?.uptime24h?.toFixed(1) || '0.0'
  const avgResponseTime = site.siteStats?.avgResponseTime24h || 0
  const currentStatus = site.siteStats?.currentStatus || 'down'
  const lastChecked = site.siteStats?.lastChecked 
    ? new Date(site.siteStats.lastChecked).toLocaleString()
    : 'Never'

  // Get status for display
  const getStatusForDisplay = () => {
    if (site.status !== 'active') return 'checking'
    return currentStatus
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {site.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <Link 
                  href={site.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {site.url}
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Check every {site.interval}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                {site.status}
              </Badge>
              {site.siteStats && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    Last checked: {lastChecked}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Bar - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <StatusBar 
              status={getStatusForDisplay()} 
              pings={pings.slice(-10)} // Last 10 pings for visualization
              lastChecked={lastChecked}
              siteId={params.id}
            />
          </div>
          
          {/* Main Stats Card - Takes 1 column */}
          <div>
            <MainCard 
              uptime={`${uptime}%`}
              restime={`${avgResponseTime}ms`}
              title={site.name}
              stats={site.siteStats}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <StatusChart 
            pings={pings}
            siteName={site.name}
          />
        </div>
        
      </div>
    </div>
  );
}