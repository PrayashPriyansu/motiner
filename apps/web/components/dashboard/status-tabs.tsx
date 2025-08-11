"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { FilterType, Monitor } from 'web/lib/types'
import { filterMonitorsByStatus } from 'web/lib/dummy-data'

interface StatusTabsProps {
  monitors: Monitor[]
  activeFilter: FilterType
  // onFilterChange: (filter: FilterType) => void
  children: React.ReactNode
}

export function StatusTabs({ 
  monitors, 
  activeFilter, 
  // onFilterChange, 
  children 
}: StatusTabsProps) {
  // Input validation
  if (!Array.isArray(monitors)) {
    console.error('StatusTabs: monitors must be an array');
    return null;
  }

  // Calculate counts for each filter
  const allCount = monitors.length
  const upCount = monitors.filter(m => m.status === 'up').length
  const downCount = monitors.filter(m => m.status === 'down').length

  // Get filtered monitors based on active filter
  const filteredMonitors: Monitor[] = monitors;

  return (
    <Tabs value={activeFilter} onValueChange={() => {}} className="w-full" aria-label="Monitor status tabs">
      <TabsList className="grid w-full grid-cols-3" role="tablist" aria-label="Filter monitors by status">
        <TabsTrigger 
          value="all" 
          className="flex items-center gap-2"
          aria-label={`Show all monitors (${allCount} total)`}
        >
          All
          <Badge variant="secondary" className="ml-1" aria-hidden="true">
            {allCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="up" 
          className="flex items-center gap-2"
          aria-label={`Show monitors that are up (${upCount} monitors)`}
        >
          Up
          <Badge 
            variant="secondary" 
            className="ml-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            aria-hidden="true"
          >
            {upCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="down" 
          className="flex items-center gap-2"
          aria-label={`Show monitors that are down (${downCount} monitors)`}
        >
          Down
          <Badge 
            variant="secondary" 
            className="ml-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            aria-hidden="true"
          >
            {downCount}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent 
        value={activeFilter} 
        className="mt-6"
        role="tabpanel"
        aria-label={`${activeFilter === 'all' ? 'All' : activeFilter === 'up' ? 'Up' : 'Down'} monitors (${filteredMonitors.length} items)`}
      >
        {children}
      </TabsContent>
    </Tabs>
  )
}