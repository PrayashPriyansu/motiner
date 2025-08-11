"use client"

import { MonitorCharts } from "../../components/charts/monitor-charts"
import { generateUptimeHistoryForChart } from "../../lib/dummy-data"
import { Button } from "../../components/ui/button"
import { useState } from "react"

export default function TestChartsPage() {
  const [chartData, setChartData] = useState(() => 
    generateUptimeHistoryForChart('test-monitor', 7)
  )

  const regenerateData = () => {
    const newData = generateUptimeHistoryForChart('test-monitor-' + Date.now(), 7)
    console.log('Generated new chart data:', newData.slice(0, 5))
    setChartData(newData)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Chart Testing Page</h1>
        <p className="text-muted-foreground mb-4">
          Testing chart rendering with sample data
        </p>
        <Button onClick={regenerateData} variant="outline">
          Regenerate Data
        </Button>
      </div>

      <div className="space-y-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Chart Data Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Total Data Points:</strong> {chartData.length}
            </div>
            <div>
              <strong>Up Points:</strong> {chartData.filter(d => d.status === 'up').length}
            </div>
            <div>
              <strong>Down Points:</strong> {chartData.filter(d => d.status === 'down').length}
            </div>
            <div>
              <strong>Avg Response Time:</strong> {
                Math.round(
                  chartData
                    .filter(d => d.status === 'up')
                    .reduce((sum, d) => sum + d.responseTime, 0) / 
                  chartData.filter(d => d.status === 'up').length
                )
              }ms
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <MonitorCharts 
            data={chartData} 
            monitorName="Test Monitor" 
          />
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Sample Data (First 10 points)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Timestamp</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Response Time</th>
                </tr>
              </thead>
              <tbody>
                {chartData.slice(0, 10).map((point, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-mono text-xs">
                      {point.timestamp.toLocaleString()}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        point.status === 'up' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {point.status}
                      </span>
                    </td>
                    <td className="p-2 font-mono">{point.responseTime}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}