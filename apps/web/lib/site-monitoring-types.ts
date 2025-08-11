export interface SiteMonitor {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'checking';
  createdAt: Date;
  updatedAt: Date;
  lastPing?: {
    responseTime: number;
    timestamp: Date;
    status: 'up' | 'down';
  };
  checkInterval?: number; // minutes
  timeout?: number; // seconds
  tags?: string[];
}

export interface PingData {
  timestamp: Date;
  responseTime: number;
  status: 'up' | 'down';
  statusCode?: number;
  errorMessage?: string;
}

export interface UptimeData {
  date: string;
  uptime: number; // percentage
}

export interface LatencyData {
  timestamp: Date;
  latency: number;
}

export interface SiteMetrics {
  uptime24h: number;
  uptime7d: number;
  uptime30d: number;
  avgResponseTime: number;
  totalPings: number;
  successfulPings: number;
}

// New interfaces for enhanced functionality
export interface ResponseTimeData {
  timestamp: Date;
  responseTime: number;
  status: 'up' | 'down';
}

export interface MetricCard {
  title: string;
  value: string | number;
  change?: number; // percentage change
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export interface LiveUpdateConfig {
  interval: number; // seconds
  enabled: boolean;
  lastUpdate: Date;
}