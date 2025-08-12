"use client"

import React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "web/components/ui/chart"

interface PingData {
  id: string
  checkedAt: string
  isUp: boolean
  responseTime?: number
  statusCode?: number
  error?: string
}

interface StatusChartProps {
  pings: PingData[]
  siteName: string
}

const chartConfig = {
  responseTime: {
    label: "Response Time (ms)",
    color: "hsl(var(--chart-1))",
  },
  downtime: {
    label: "Downtime",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

export default function StatusChart({ pings, siteName }: StatusChartProps) {
  // Transform ping data for the chart
  const chartData = pings
    .slice(-50) // Show last 50 pings
    .map((ping) => ({
      checkedAt: ping.checkedAt,
      responseTime: ping.isUp ? (ping.responseTime || 0) : 0,
      isUp: ping.isUp,
      statusCode: ping.statusCode,
      error: ping.error,
      // Add fill color based on status
      fill: ping.isUp ? chartConfig.responseTime.color : chartConfig.downtime.color,
    }))
    .reverse() // Show chronologically

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Response Time History
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No ping data available for {siteName}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Response Time History
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last {chartData.length} pings for {siteName}
        </p>
      </div>
      
      <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barCategoryGap="10%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="checkedAt"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleTimeString(undefined, { 
                hour: "2-digit", 
                minute: "2-digit",
                month: "short",
                day: "numeric"
              })
            }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
          />
          <Bar
            dataKey="responseTime"
            radius={[2, 2, 0, 0]}
            fill={(entry: any) => entry.fill}
          />
          <ChartTooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(label).toLocaleString()}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className={`text-sm ${data.isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Status: {data.isUp ? 'Up' : 'Down'}
                      </p>
                      {data.isUp && data.responseTime > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Response Time: {data.responseTime}ms
                        </p>
                      )}
                      {data.statusCode && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Status Code: {data.statusCode}
                        </p>
                      )}
                      {data.error && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Error: {data.error}
                        </p>
                      )}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}