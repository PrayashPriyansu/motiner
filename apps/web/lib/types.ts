export interface Monitor {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down';
  uptime24h: number; // Percentage
  avgResponseTime: number; // Milliseconds
  lastChecked: Date;
  createdAt: Date;
}

export interface DashboardMetrics {
  totalMonitors: number;
  uptime24h: number;
  downtimeIncidents7d: number;
  avgResponseTime: number;
}

export interface UptimeDataPoint {
  timestamp: Date;
  status: 'up' | 'down';
  responseTime: number;
}

export interface NewMonitor {
  name: string;
  url: string;
  checkInterval: number; // Minutes
  slug: string;
}

export type FilterType = 'all' | 'up' | 'down';