import { SiteMonitor, PingData, UptimeData, LatencyData, SiteMetrics, ResponseTimeData, MetricCard } from './site-monitoring-types';
import { TrendingUp, Zap, Search, CheckCircle } from 'lucide-react';

// Generate dummy site data
export function generateSiteMonitor(id: string): SiteMonitor {
  const sites = [
    { name: 'Main Website', url: 'https://example.com' },
    { name: 'API Gateway', url: 'https://api.example.com' },
    { name: 'User Dashboard', url: 'https://dashboard.example.com' },
    { name: 'Payment Service', url: 'https://payments.example.com' },
    { name: 'CDN Endpoint', url: 'https://cdn.example.com' },
    { name: 'Database Service', url: 'https://db.example.com' },
  ];
  
  const site = sites[Math.floor(Math.random() * sites.length)];
  const status = Math.random() > 0.1 ? 'up' : 'down'; // 90% uptime
  const checkIntervals = [1, 5, 10, 15, 30]; // minutes
  const timeouts = [10, 30, 60]; // seconds
  const tagOptions = ['production', 'staging', 'critical', 'api', 'frontend', 'backend'];
  
  return {
    id,
    name: site.name,
    url: site.url,
    status,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
    checkInterval: checkIntervals[Math.floor(Math.random() * checkIntervals.length)],
    timeout: timeouts[Math.floor(Math.random() * timeouts.length)],
    tags: tagOptions.slice(0, Math.floor(Math.random() * 3) + 1), // 1-3 random tags
    lastPing: {
      responseTime: status === 'up' ? Math.floor(Math.random() * 500) + 50 : 0,
      timestamp: new Date(Date.now() - Math.random() * 5 * 60 * 1000),
      status,
    },
  };
}

// Generate ping history data
export function generatePingHistory(hours: number = 24): PingData[] {
  const data: PingData[] = [];
  const now = new Date();
  
  for (let i = hours * 12; i >= 0; i--) { // Every 5 minutes
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000);
    const status = Math.random() > 0.05 ? 'up' : 'down'; // 95% uptime
    
    data.push({
      timestamp,
      responseTime: status === 'up' ? Math.floor(Math.random() * 400) + 50 : 0,
      status,
    });
  }
  
  return data;
}

// Generate uptime data for the last 30 days
export function generateUptimeData(): UptimeData[] {
  const data: UptimeData[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const uptime = Math.random() * 10 + 90; // 90-100% uptime
    
    data.push({
      date: date.toISOString().split('T')[0],
      uptime: Math.round(uptime * 100) / 100,
    });
  }
  
  return data;
}

// Generate latency data
export function generateLatencyData(hours: number = 24): LatencyData[] {
  const data: LatencyData[] = [];
  const now = new Date();
  
  for (let i = hours * 6; i >= 0; i--) { // Every 10 minutes
    const timestamp = new Date(now.getTime() - i * 10 * 60 * 1000);
    const latency = Math.floor(Math.random() * 300) + 50; // 50-350ms
    
    data.push({
      timestamp,
      latency,
    });
  }
  
  return data;
}

// Calculate site metrics
export function calculateSiteMetrics(pingData: PingData[]): SiteMetrics {
  const now = new Date();
  const last24h = pingData.filter(p => now.getTime() - p.timestamp.getTime() <= 24 * 60 * 60 * 1000);
  const last7d = pingData.filter(p => now.getTime() - p.timestamp.getTime() <= 7 * 24 * 60 * 60 * 1000);
  const last30d = pingData.filter(p => now.getTime() - p.timestamp.getTime() <= 30 * 24 * 60 * 60 * 1000);
  
  const upPings24h = last24h.filter(p => p.status === 'up');
  const upPings7d = last7d.filter(p => p.status === 'up');
  const upPings30d = last30d.filter(p => p.status === 'up');
  
  const avgResponseTime = upPings24h.length > 0 
    ? upPings24h.reduce((sum, p) => sum + p.responseTime, 0) / upPings24h.length
    : 0;
  
  return {
    uptime24h: last24h.length > 0 ? (upPings24h.length / last24h.length) * 100 : 100,
    uptime7d: last7d.length > 0 ? (upPings7d.length / last7d.length) * 100 : 100,
    uptime30d: last30d.length > 0 ? (upPings30d.length / last30d.length) * 100 : 100,
    avgResponseTime: Math.round(avgResponseTime),
    totalPings: pingData.length,
    successfulPings: pingData.filter(p => p.status === 'up').length,
  };
}

// Generate response time data
export function generateResponseTimeData(hours: number = 24): ResponseTimeData[] {
  const data: ResponseTimeData[] = [];
  const now = new Date();
  
  for (let i = hours * 12; i >= 0; i--) { // Every 5 minutes
    const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000);
    const status = Math.random() > 0.05 ? 'up' : 'down'; // 95% uptime
    
    data.push({
      timestamp,
      responseTime: status === 'up' ? Math.floor(Math.random() * 400) + 50 : 0,
      status,
    });
  }
  
  return data;
}

// Generate realistic latency patterns with network congestion simulation
export function generateRealisticLatencyData(hours: number = 24): LatencyData[] {
  const data: LatencyData[] = [];
  const now = new Date();
  let baseLatency = 100; // Base latency in ms
  
  for (let i = hours * 6; i >= 0; i--) { // Every 10 minutes
    const timestamp = new Date(now.getTime() - i * 10 * 60 * 1000);
    
    // Simulate network congestion patterns (higher latency during peak hours)
    const hour = timestamp.getHours();
    const peakMultiplier = (hour >= 9 && hour <= 17) ? 1.5 : 1.0; // Business hours
    
    // Add some randomness and occasional spikes
    const spike = Math.random() > 0.95 ? 2.0 : 1.0; // 5% chance of spike
    const randomVariation = 0.8 + Math.random() * 0.4; // ±20% variation
    
    const latency = Math.floor(baseLatency * peakMultiplier * spike * randomVariation);
    
    data.push({
      timestamp,
      latency: Math.max(20, latency), // Minimum 20ms latency
    });
    
    // Gradually change base latency for more realistic patterns
    baseLatency += (Math.random() - 0.5) * 10;
    baseLatency = Math.max(50, Math.min(200, baseLatency)); // Keep between 50-200ms
  }
  
  return data;
}

// Enhanced ping simulation with more realistic behavior
export function simulatePing(url: string): Promise<PingData> {
  return new Promise((resolve) => {
    const delay = Math.random() * 1000 + 200; // 200-1200ms delay for simulation
    
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% success rate
      const statusCodes = success ? [200, 201, 204] : [404, 500, 503, 408];
      const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];
      
      const result: PingData = {
        timestamp: new Date(),
        responseTime: success ? Math.floor(Math.random() * 400) + 50 : 0,
        status: success ? 'up' : 'down',
        statusCode,
      };
      
      if (!success) {
        const errors = [
          'Connection timeout',
          'DNS resolution failed',
          'Server not responding',
          'Network unreachable',
          'SSL certificate error'
        ];
        result.errorMessage = errors[Math.floor(Math.random() * errors.length)];
      }
      
      resolve(result);
    }, delay);
  });
}

// Generate a specific site monitor by ID for individual page
export function getSiteMonitorById(id: string): SiteMonitor {
  // For demo purposes, create consistent data based on ID
  const siteConfigs = {
    '1': { name: 'Main Website', url: 'https://example.com', tags: ['production', 'critical'] },
    '2': { name: 'API Gateway', url: 'https://api.example.com', tags: ['production', 'api'] },
    '3': { name: 'User Dashboard', url: 'https://dashboard.example.com', tags: ['production', 'frontend'] },
    '4': { name: 'Payment Service', url: 'https://payments.example.com', tags: ['production', 'critical', 'backend'] },
  };
  
  const config = siteConfigs[id as keyof typeof siteConfigs] || siteConfigs['1'];
  const status = Math.random() > 0.1 ? 'up' : 'down'; // 90% uptime
  
  return {
    id,
    name: config.name,
    url: config.url,
    status,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000), // Within last hour
    checkInterval: 5, // 5 minutes
    timeout: 30, // 30 seconds
    tags: config.tags,
    lastPing: {
      responseTime: status === 'up' ? Math.floor(Math.random() * 300) + 50 : 0,
      timestamp: new Date(Date.now() - Math.random() * 5 * 60 * 1000),
      status,
    },
  };
}

// Generate metric cards data
export function generateMetricCards(pingData: PingData[], previousMetrics?: SiteMetrics): MetricCard[] {
  const metrics = calculateSiteMetrics(pingData);
  
  const calculateTrend = (current: number, previous?: number): 'up' | 'down' | 'neutral' => {
    if (!previous) return 'neutral';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  };
  
  const calculateChange = (current: number, previous?: number): number => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };
  
  return [
    {
      title: 'Uptime (24h)',
      value: `${metrics.uptime24h.toFixed(1)}%`,
      change: calculateChange(metrics.uptime24h, previousMetrics?.uptime24h),
      trend: calculateTrend(metrics.uptime24h, previousMetrics?.uptime24h),
      icon: TrendingUp,
    },
    {
      title: 'Avg Response Time',
      value: `${metrics.avgResponseTime}ms`,
      change: calculateChange(metrics.avgResponseTime, previousMetrics?.avgResponseTime),
      trend: calculateTrend(previousMetrics?.avgResponseTime || 0, metrics.avgResponseTime), // Inverted for response time
      icon: Zap,
    },
    {
      title: 'Total Checks',
      value: metrics.totalPings,
      change: calculateChange(metrics.totalPings, previousMetrics?.totalPings),
      trend: calculateTrend(metrics.totalPings, previousMetrics?.totalPings),
      icon: Search,
    },
    {
      title: 'Success Rate',
      value: `${((metrics.successfulPings / metrics.totalPings) * 100).toFixed(1)}%`,
      change: calculateChange(
        (metrics.successfulPings / metrics.totalPings) * 100,
        previousMetrics ? (previousMetrics.successfulPings / previousMetrics.totalPings) * 100 : undefined
      ),
      trend: calculateTrend(
        (metrics.successfulPings / metrics.totalPings) * 100,
        previousMetrics ? (previousMetrics.successfulPings / previousMetrics.totalPings) * 100 : undefined
      ),
      icon: CheckCircle,
    },
  ];
}