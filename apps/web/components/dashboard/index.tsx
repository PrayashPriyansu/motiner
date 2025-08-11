import { Suspense } from 'react'
import { OverviewCards } from './overview-cards'
import { StatusTabs } from './status-tabs'
import { UptimeTable } from './uptime-table'
import { OverviewCardsSkeleton, StatusTabsSkeleton, ChartSkeleton } from './dashboard-skeleton'
import { getMonitors } from 'web/data/dashboard/get-monitors'

export default async function DashBoardMain() {
  const monitors = await getMonitors()

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">





      {/* <section>
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <OverviewCards monitors={monitors} />
        </Suspense>
      </section> */}

      <section>
        <h2 className="text-lg font-semibold mb-4">Monitor Status</h2>
        <Suspense fallback={<StatusTabsSkeleton />}>
          <StatusTabs monitors={monitors} activeFilter='all' >
             <UptimeTable monitors={monitors} />
          </StatusTabs>
        </Suspense>
      </section>

      {/* {monitors.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Monitor Charts</h2>
          <Suspense fallback={<ChartSkeleton />}>
            <MonitorCharts data={} monitorName={monitors[0].name} />
          </Suspense>
        </section>
      )} */}
    </main>
  )
}
