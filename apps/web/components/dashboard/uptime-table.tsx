"use client"

import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { StatusBadge } from '../ui/status-badge'
import { Monitor } from 'web/lib/types'
import { formatResponseTime, getUptimeColor } from 'web/lib/utils'
import { getRelativeTime } from 'web/lib/dummy-data'
import { ExternalLink, Eye } from 'lucide-react'
import { Button } from '../ui/button'

interface UptimeTableProps {
  monitors: Monitor[]
}

export function UptimeTable({ monitors }: UptimeTableProps) {
  // Input validation
  if (!Array.isArray(monitors)) {
    console.error('UptimeTable: monitors must be an array');
    return (
      <div className="text-center py-8 text-red-600">
        Error: Invalid monitor data
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Monitor Name</TableHead>
              <TableHead scope="col">URL</TableHead>
              <TableHead scope="col">Current Status</TableHead>
              <TableHead scope="col" className="text-right">Uptime (Last 24h)</TableHead>
              <TableHead scope="col" className="text-right">Avg Response Time</TableHead>
              <TableHead scope="col" className="text-right">Last Checked</TableHead>
              <TableHead scope="col" className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No monitors found
                </TableCell>
              </TableRow>
            ) : (
              monitors.map((monitor) => (
                <TableRow key={monitor.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <span title={monitor.name}>{monitor.name}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-muted-foreground text-sm font-mono truncate max-w-[200px]"
                        title={monitor.url}
                      >
                        {monitor.url}
                      </span>
                      <Link
                        href={monitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        aria-label={`Open ${monitor.name} in new tab`}
                        title={`Open ${monitor.url} in new tab`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* <StatusBadge status={monitor.status} /> */}
                    <StatusBadge status={"up"} />
                  </TableCell>
                  <TableCell className="text-right">
                    <span 
                      // className={getUptimeColor(monitor.uptime24h)}
                      // title={`Uptime: ${monitor.uptime24h.toFixed(2)}%`}
                      className='text-green-500'
                      title={`Uptime: 100%`}
                    >
                      {/* {monitor.uptime24h.toFixed(2)}% */}
                      100%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span 
                      className="font-mono text-sm"
                      // title={`Average response time: ${formatResponseTime(monitor.avgResponseTime)}`}
                      title="Average response time: 100ms"
                    
                    >
                      {/* {formatResponseTime(monitor.avgResponseTime)} */}
                      100ms
                    </span>
                  </TableCell>
                  <TableCell 
                    className="text-right text-muted-foreground text-sm"
                    // title={`Last checked: ${monitor.lastChecked.toLocaleString()}`}
                    title="Last checked: 2 days ago"
                  >
                    {/* {getRelativeTime(monitor.lastChecked)} */}
                    2 days ago
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/monitors/${monitor.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="h-3 w-3" />
                        <span className="sr-only">View details for {monitor.name}</span>
                        Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4" role="list" aria-label="Monitor list">
        {monitors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No monitors found
          </div>
        ) : (
          monitors.map((monitor) => (
            <div 
              key={monitor.id} 
              className="border rounded-lg p-4 space-y-3"
              role="listitem"
              aria-label={`Monitor: ${monitor.name}`}
            >
              {/* Header with name and status */}
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate pr-2" title={monitor.name}>
                  {monitor.name}
                </h3>
                <StatusBadge status={monitor.status} />
              </div>
              
              {/* URL */}
              <div className="flex items-center gap-2">
                <span 
                  className="text-muted-foreground text-sm font-mono truncate"
                  title={monitor.url}
                >
                  {monitor.url}
                </span>
                <a
                  href={monitor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  aria-label={`Open ${monitor.name} in new tab`}
                  title={`Open ${monitor.url} in new tab`}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <div className="text-xs text-muted-foreground">Uptime (24h)</div>
                  {/* <div className={`text-sm font-medium ${getUptimeColor(monitor.uptime24h)}`}> */}
                  <div className='text-sm font-medium text-green-500'>
                    {/* {monitor.uptime24h.toFixed(2)}% */}
                    100%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Response Time</div>
                  <div className="text-sm font-medium font-mono">
                    {/* {formatResponseTime(monitor.avgResponseTime)} */}
                    100ms
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Last Checked</div>
                  <div className="text-sm">
                    {/* {getRelativeTime(monitor.lastChecked)} */}
                    2 days ago
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link href={`/monitors/${monitor.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3 w-3" />
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}