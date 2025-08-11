"use client"

import React, { useState } from 'react'
import { StatusBadge, MetricCard } from './ui'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ThemeToggle } from './theme-toggle'
import { StatusTabs } from './dashboard/status-tabs'
import { UptimeTable } from './dashboard/uptime-table'
import { OverviewCards } from './dashboard/overview-cards'
import { AddMonitorForm } from './monitors/add-monitor-form'
import ErrorBoundary, { ChartErrorFallback, TableErrorFallback } from './error-boundary'
import { testScenarios, runAllTests } from '../lib/test-scenarios'
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { FilterType, NewMonitor } from '../lib/types'

// Test component to verify our custom components work
export function TestComponents() {
  const [activeTest, setActiveTest] = useState<string>('basic')
  const [testResults, setTestResults] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const clearResults = () => {
    setTestResults([])
  }

  const handleFormSubmit = (monitor: NewMonitor) => {
    addTestResult(`✅ Form submitted: ${monitor.name} - ${monitor.url}`)
    return Promise.resolve()
  }

  const handleFormCancel = () => {
    addTestResult('❌ Form cancelled')
  }

  const TestErrorComponent = () => {
    throw new Error('Test error for error boundary')
  }

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Component Testing Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={activeTest === 'basic' ? 'default' : 'outline'}
              onClick={() => setActiveTest('basic')}
              size="sm"
            >
              Basic Components
            </Button>
            <Button 
              variant={activeTest === 'theme' ? 'default' : 'outline'}
              onClick={() => setActiveTest('theme')}
              size="sm"
            >
              Theme Toggle
            </Button>
            <Button 
              variant={activeTest === 'filtering' ? 'default' : 'outline'}
              onClick={() => setActiveTest('filtering')}
              size="sm"
            >
              Filtering
            </Button>
            <Button 
              variant={activeTest === 'form' ? 'default' : 'outline'}
              onClick={() => setActiveTest('form')}
              size="sm"
            >
              Form Validation
            </Button>
            <Button 
              variant={activeTest === 'errors' ? 'default' : 'outline'}
              onClick={() => setActiveTest('errors')}
              size="sm"
            >
              Error Handling
            </Button>
            <Button 
              variant={activeTest === 'data' ? 'default' : 'outline'}
              onClick={() => setActiveTest('data')}
              size="sm"
            >
              Data Scenarios
            </Button>
          </div>

          {/* Test Results */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Test Results</h3>
              <div className="flex gap-2">
                <Button onClick={runAllTests} variant="outline" size="sm">
                  Run All Tests
                </Button>
                <Button onClick={clearResults} variant="ghost" size="sm">
                  Clear
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono max-h-32 overflow-auto">
              {testResults.length === 0 ? (
                <p className="text-muted-foreground">No test results yet...</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))
              )}
            </div>
          </div>

          {/* Test Content */}
          {activeTest === 'basic' && (
            <div className="space-y-4">
              <h3 className="font-medium">Basic UI Components</h3>
              <div className="flex gap-2">
                <StatusBadge status="up" />
                <StatusBadge status="down" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="Total Monitors"
                  value="15"
                  icon={<Activity className="h-4 w-4" />}
                  subtitle="All systems"
                />
                <MetricCard
                  title="Uptime"
                  value="99.9%"
                  icon={<CheckCircle className="h-4 w-4" />}
                  trend="up"
                  subtitle="Last 24 hours"
                />
              </div>
            </div>
          )}

          {activeTest === 'theme' && (
            <div className="space-y-4">
              <h3 className="font-medium">Theme Toggle Testing</h3>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <p className="text-sm text-muted-foreground">
                  Test theme switching and verify persistence
                </p>
              </div>
            </div>
          )}

          {activeTest === 'filtering' && (
            <div className="space-y-4">
              <h3 className="font-medium">Status Filtering</h3>
              <StatusTabs
                monitors={testScenarios.mixedStatusMonitors}
                activeFilter={activeFilter}
                onFilterChange={(filter) => {
                  setActiveFilter(filter)
                  addTestResult(`🔍 Filter changed to: ${filter}`)
                }}
              >
                {(filteredMonitors) => (
                  <UptimeTable monitors={filteredMonitors} />
                )}
              </StatusTabs>
            </div>
          )}

          {activeTest === 'form' && (
            <div className="space-y-4">
              <h3 className="font-medium">Form Validation Testing</h3>
              <AddMonitorForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          {activeTest === 'errors' && (
            <div className="space-y-4">
              <h3 className="font-medium">Error Boundary Testing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ErrorBoundary fallback={ChartErrorFallback}>
                  <Button 
                    onClick={() => {
                      throw new Error('Test chart error')
                    }}
                    variant="destructive"
                    size="sm"
                  >
                    Trigger Chart Error
                  </Button>
                </ErrorBoundary>

                <ErrorBoundary fallback={TableErrorFallback}>
                  <Button 
                    onClick={() => {
                      throw new Error('Test table error')
                    }}
                    variant="destructive"
                    size="sm"
                  >
                    Trigger Table Error
                  </Button>
                </ErrorBoundary>
              </div>
            </div>
          )}

          {activeTest === 'data' && (
            <div className="space-y-4">
              <h3 className="font-medium">Data Scenario Testing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Empty Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OverviewCards 
                      metrics={{
                        totalMonitors: 0,
                        uptime24h: 0,
                        downtimeIncidents7d: 0,
                        avgResponseTime: 0,
                      }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Single Monitor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UptimeTable monitors={testScenarios.singleUpMonitor} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Edge Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UptimeTable monitors={testScenarios.edgeCaseMonitors} />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}