import { Monitor, DashboardMetrics, UptimeDataPoint } from './types';

// Sample monitor data with realistic names and URLs
const SAMPLE_MONITORS = [
  { name: 'Main Website', url: 'https://example.com' },
  { name: 'API Gateway', url: 'https://api.example.com' },
  { name: 'User Dashboard', url: 'https://dashboard.example.com' },
  { name: 'Payment Service', url: 'https://payments.example.com' },
  { name: 'Authentication API', url: 'https://auth.example.com' },
  { name: 'File Storage', url: 'https://cdn.example.com' },
  { name: 'Email Service', url: 'https://mail.example.com' },
  { name: 'Analytics Platform', url: 'https://analytics.example.com' },
  { name: 'Support Portal', url: 'https://support.example.com' },
  { name: 'Admin Panel', url: 'https://admin.example.com' },
  { name: 'Mobile API', url: 'https://mobile-api.example.com' },
  { name: 'Webhook Service', url: 'https://webhooks.example.com' },
  { name: 'Search Engine', url: 'https://search.example.com' },
  { name: 'Notification Service', url: 'https://notifications.example.com' },
  { name: 'Backup System', url: 'https://backup.example.com' },
];

// Generate random response time with realistic patterns
function generateResponseTime(status: 'up' | 'down'): number {
  if (status === 'down') return 0;
  
  // Most responses are fast (50-200ms), with occasional slower ones
  const rand = Math.random();
  if (rand < 0.7) return Math.floor(Math.random() * 150) + 50; // 50-200ms
  if (rand < 0.9) return Math.floor(Math.random() * 300) + 200; // 200-500ms
  return Math.floor(Math.random() * 1000) + 500; // 500-1500ms (slow)
}

// Generate uptime history for a monitor over the last 30 days
function generateUptimeHistory(): UptimeDataPoint[] {
  const history: UptimeDataPoint[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Generate data points every 5 minutes for the last 30 days
  for (let time = thirtyDaysAgo.getTime(); time <= now.getTime(); time += 5 * 60 * 1000) {
    const timestamp = new Date(time);
    
    // Most monitors are up most of the time (95% uptime)
    // But introduce some realistic downtime patterns
    let status: 'up' | 'down' = 'up';
    
    // Simulate occasional outages (5% chance of being down)
    if (Math.random() < 0.05) {
      status = 'down';
    }
    
    // Simulate maintenance windows (Sunday 2-4 AM UTC)
    const hour = timestamp.getUTCHours();
    const day = timestamp.getUTCDay();
    if (day === 0 && hour >= 2 && hour < 4 && Math.random() < 0.3) {
      status = 'down';
    }
    
    history.push({
      timestamp,
      status,
      responseTime: generateResponseTime(status),
    });
  }
  
  return history;
}

// Calculate uptime percentage for the last 24 hours
function calculateUptime24h(history: UptimeDataPoint[]): number {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentHistory = history.filter(point => point.timestamp >= twentyFourHoursAgo);
  
  if (recentHistory.length === 0) return 100;
  
  const upCount = recentHistory.filter(point => point.status === 'up').length;
  return Math.round((upCount / recentHistory.length) * 100 * 100) / 100; // Round to 2 decimal places
}

// Calculate average response time for the last 24 hours
function calculateAvgResponseTime(history: UptimeDataPoint[]): number {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentHistory = history.filter(
    point => point.timestamp >= twentyFourHoursAgo && point.status === 'up'
  );
  
  if (recentHistory.length === 0) return 0;
  
  const totalResponseTime = recentHistory.reduce((sum, point) => sum + point.responseTime, 0);
  return Math.round(totalResponseTime / recentHistory.length);
}

// Generate a random timestamp within the last 10 minutes
function generateRecentTimestamp(): Date {
  const now = Date.now();
  const tenMinutesAgo = now - 10 * 60 * 1000;
  const randomTime = tenMinutesAgo + Math.random() * (now - tenMinutesAgo);
  return new Date(randomTime);
}

// Generate dummy monitors with realistic data
export function generateDummyMonitors(): Monitor[] {
  return SAMPLE_MONITORS.map((sample, index) => {
    const id = `monitor-${index + 1}`;
    const history = generateUptimeHistory();
    const uptime24h = calculateUptime24h(history);
    const avgResponseTime = calculateAvgResponseTime(history);
    
    // Current status based on recent uptime
    const currentStatus: 'up' | 'down' = uptime24h > 50 ? 'up' : 'down';
    
    return {
      id,
      name: sample.name,
      url: sample.url,
      status: currentStatus,
      uptime24h,
      avgResponseTime,
      lastChecked: generateRecentTimestamp(),
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
    };
  });
}

// Generate dashboard metrics based on monitor data
export function generateDashboardMetrics(monitors: Monitor[]): DashboardMetrics {
  // Input validation
  if (!Array.isArray(monitors)) {
    throw new Error('Monitors must be an array');
  }
  const totalMonitors = monitors.length;
  
  // Calculate overall uptime percentage (weighted average)
  const totalUptime = monitors.reduce((sum, monitor) => sum + monitor.uptime24h, 0);
  const uptime24h = totalMonitors > 0 ? Math.round((totalUptime / totalMonitors) * 100) / 100 : 100;
  
  // Calculate average response time across all monitors
  const activeMonitors = monitors.filter(m => m.status === 'up');
  const totalResponseTime = activeMonitors.reduce((sum, monitor) => sum + monitor.avgResponseTime, 0);
  const avgResponseTime = activeMonitors.length > 0 ? Math.round(totalResponseTime / activeMonitors.length) : 0;
  
  // Simulate downtime incidents in the last 7 days (based on uptime percentages)
  const downtimeIncidents7d = monitors.reduce((incidents, monitor) => {
    // Estimate incidents based on uptime percentage
    const uptimeDecimal = monitor.uptime24h / 100;
    const estimatedIncidents = uptimeDecimal < 0.99 ? Math.floor(Math.random() * 3) + 1 : 0;
    return incidents + estimatedIncidents;
  }, 0);
  
  return {
    totalMonitors,
    uptime24h,
    downtimeIncidents7d,
    avgResponseTime,
  };
}

// Generate uptime history for charts
export function generateUptimeHistoryForChart(monitorId: string, days: number = 7): UptimeDataPoint[] {
  // Input validation
  if (!monitorId || typeof monitorId !== 'string') {
    throw new Error('Invalid monitorId provided');
  }
  
  if (days <= 0 || days > 365) {
    throw new Error('Days must be between 1 and 365');
  }
  const history: UptimeDataPoint[] = [];
  const now = new Date();
  const startTime = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // Generate data points every hour
  for (let time = startTime.getTime(); time <= now.getTime(); time += 60 * 60 * 1000) {
    const timestamp = new Date(time);
    
    // Most of the time the service is up (95% uptime)
    let status: 'up' | 'down' = Math.random() < 0.95 ? 'up' : 'down';
    
    // Simulate maintenance windows and patterns
    const hour = timestamp.getUTCHours();
    const day = timestamp.getUTCDay();
    
    // Sunday maintenance window
    if (day === 0 && hour >= 2 && hour < 4) {
      status = Math.random() < 0.7 ? 'down' : 'up';
    }
    
    history.push({
      timestamp,
      status,
      responseTime: generateResponseTime(status),
    });
  }
  
  return history;
}

// Utility function to get relative time string
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Filter monitors by status
export function filterMonitorsByStatus(monitors: Monitor[], filter: 'all' | 'up' | 'down'): Monitor[] {
  // Input validation
  if (!Array.isArray(monitors)) {
    throw new Error('Monitors must be an array');
  }
  
  if (!['all', 'up', 'down'].includes(filter)) {
    throw new Error('Filter must be "all", "up", or "down"');
  }
  
  if (filter === 'all') return monitors;
  return monitors.filter(monitor => monitor.status === filter);
}