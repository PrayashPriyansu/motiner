/**
 * Test scenarios and edge cases for the uptime monitoring dashboard
 * This file contains various test data scenarios to validate the application
 */

import { Monitor, DashboardMetrics, UptimeDataPoint, FilterType } from './types';
import { 
  generateDummyMonitors, 
  generateDashboardMetrics, 
  generateUptimeHistoryForChart,
  filterMonitorsByStatus,
  getRelativeTime
} from './dummy-data';

// Test data scenarios
export const testScenarios = {
  // Empty data scenarios
  emptyMonitors: [] as Monitor[],
  
  // Single monitor scenarios
  singleUpMonitor: [
    {
      id: 'test-1',
      name: 'Test Monitor',
      url: 'https://example.com',
      status: 'up' as const,
      uptime24h: 99.5,
      avgResponseTime: 150,
      lastChecked: new Date(),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    }
  ] as Monitor[],
  
  singleDownMonitor: [
    {
      id: 'test-2',
      name: 'Failed Monitor',
      url: 'https://down-site.com',
      status: 'down' as const,
      uptime24h: 0,
      avgResponseTime: 0,
      lastChecked: new Date(Date.now() - 5 * 60 * 1000),
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    }
  ] as Monitor[],
  
  // Mixed status monitors
  mixedStatusMonitors: [
    {
      id: 'test-3',
      name: 'Healthy API',
      url: 'https://api.example.com',
      status: 'up' as const,
      uptime24h: 100,
      avgResponseTime: 85,
      lastChecked: new Date(Date.now() - 30 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'test-4',
      name: 'Unstable Service',
      url: 'https://unstable.example.com',
      status: 'up' as const,
      uptime24h: 85.5,
      avgResponseTime: 450,
      lastChecked: new Date(Date.now() - 2 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'test-5',
      name: 'Down Service',
      url: 'https://broken.example.com',
      status: 'down' as const,
      uptime24h: 15.2,
      avgResponseTime: 0,
      lastChecked: new Date(Date.now() - 10 * 60 * 1000),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    }
  ] as Monitor[],
  
  // Edge case monitors
  edgeCaseMonitors: [
    {
      id: 'test-6',
      name: 'Very Long Monitor Name That Should Be Truncated Properly',
      url: 'https://very-long-domain-name-that-should-be-handled-properly.example.com/with/long/path',
      status: 'up' as const,
      uptime24h: 99.99,
      avgResponseTime: 1,
      lastChecked: new Date(Date.now() - 1000),
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'test-7',
      name: 'Slow Response',
      url: 'https://slow.example.com',
      status: 'up' as const,
      uptime24h: 95.0,
      avgResponseTime: 5000,
      lastChecked: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1000),
    }
  ] as Monitor[],
  
  // Large dataset
  largeDataset: Array.from({ length: 50 }, (_, i) => ({
    id: `large-test-${i}`,
    name: `Monitor ${i + 1}`,
    url: `https://site${i + 1}.example.com`,
    status: (Math.random() > 0.8 ? 'down' : 'up') as 'up' | 'down',
    uptime24h: Math.random() * 100,
    avgResponseTime: Math.floor(Math.random() * 1000) + 50,
    lastChecked: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
  })) as Monitor[]
};

// Test functions for validation
export const testFunctions = {
  // Test data generation functions
  testGenerateDummyMonitors: () => {
    try {
      const monitors = generateDummyMonitors();
      console.log('✅ generateDummyMonitors: Success', { count: monitors.length });
      return monitors;
    } catch (error) {
      console.error('❌ generateDummyMonitors: Failed', error);
      return [];
    }
  },
  
  testGenerateDashboardMetrics: (monitors: Monitor[]) => {
    try {
      const metrics = generateDashboardMetrics(monitors);
      console.log('✅ generateDashboardMetrics: Success', metrics);
      return metrics;
    } catch (error) {
      console.error('❌ generateDashboardMetrics: Failed', error);
      return {
        totalMonitors: 0,
        uptime24h: 0,
        downtimeIncidents7d: 0,
        avgResponseTime: 0,
      };
    }
  },
  
  testGenerateUptimeHistory: (monitorId: string, days: number = 7) => {
    try {
      const history = generateUptimeHistoryForChart(monitorId, days);
      console.log('✅ generateUptimeHistoryForChart: Success', { 
        monitorId, 
        days, 
        dataPoints: history.length 
      });
      return history;
    } catch (error) {
      console.error('❌ generateUptimeHistoryForChart: Failed', error);
      return [];
    }
  },
  
  // Test filtering functions
  testFilterMonitors: (monitors: Monitor[], filter: FilterType) => {
    try {
      const filtered = filterMonitorsByStatus(monitors, filter);
      console.log('✅ filterMonitorsByStatus: Success', { 
        filter, 
        original: monitors.length, 
        filtered: filtered.length 
      });
      return filtered;
    } catch (error) {
      console.error('❌ filterMonitorsByStatus: Failed', error);
      return monitors;
    }
  },
  
  // Test edge cases
  testEdgeCases: () => {
    const results = {
      emptyArray: true,
      invalidFilter: true,
      invalidMonitorId: true,
      invalidDays: true,
    };
    
    // Test empty array
    try {
      generateDashboardMetrics([]);
      filterMonitorsByStatus([], 'all');
    } catch (error) {
      console.error('❌ Empty array handling failed', error);
      results.emptyArray = false;
    }
    
    // Test invalid filter
    try {
      filterMonitorsByStatus(testScenarios.mixedStatusMonitors, 'invalid' as FilterType);
      results.invalidFilter = false; // Should have thrown an error
    } catch (error) {
      console.log('✅ Invalid filter properly rejected');
    }
    
    // Test invalid monitor ID
    try {
      generateUptimeHistoryForChart('', 7);
      results.invalidMonitorId = false; // Should have thrown an error
    } catch (error) {
      console.log('✅ Invalid monitor ID properly rejected');
    }
    
    // Test invalid days
    try {
      generateUptimeHistoryForChart('test', 0);
      results.invalidDays = false; // Should have thrown an error
    } catch (error) {
      console.log('✅ Invalid days properly rejected');
    }
    
    return results;
  },
  
  // Test relative time formatting
  testRelativeTime: () => {
    const now = new Date();
    const testDates = [
      new Date(now.getTime() - 30 * 1000), // 30 seconds ago
      new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
      new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    ];
    
    testDates.forEach((date, index) => {
      const relative = getRelativeTime(date);
      console.log(`✅ Relative time ${index + 1}: ${relative}`);
    });
  }
};

// Accessibility test helpers
export const accessibilityTests = {
  // Test keyboard navigation
  testKeyboardNavigation: () => {
    console.log('🔍 Manual Test: Keyboard Navigation');
    console.log('- Tab through all interactive elements');
    console.log('- Use arrow keys in tabs');
    console.log('- Press Enter/Space on buttons');
    console.log('- Ensure focus is visible');
  },
  
  // Test screen reader compatibility
  testScreenReader: () => {
    console.log('🔍 Manual Test: Screen Reader');
    console.log('- Check aria-labels are present');
    console.log('- Verify table headers are announced');
    console.log('- Test status announcements');
    console.log('- Validate form error announcements');
  },
  
  // Test color contrast
  testColorContrast: () => {
    console.log('🔍 Manual Test: Color Contrast');
    console.log('- Check light mode contrast ratios');
    console.log('- Check dark mode contrast ratios');
    console.log('- Verify status colors are distinguishable');
    console.log('- Test with high contrast mode');
  }
};

// Performance test helpers
export const performanceTests = {
  // Test with large datasets
  testLargeDataset: () => {
    console.time('Large Dataset Rendering');
    const largeMonitors = testScenarios.largeDataset;
    const metrics = generateDashboardMetrics(largeMonitors);
    const filtered = filterMonitorsByStatus(largeMonitors, 'up');
    console.timeEnd('Large Dataset Rendering');
    
    console.log('📊 Large Dataset Performance:', {
      totalMonitors: largeMonitors.length,
      upMonitors: filtered.length,
      metrics
    });
  },
  
  // Test chart rendering performance
  testChartPerformance: () => {
    console.time('Chart Data Generation');
    const chartData = generateUptimeHistoryForChart('perf-test', 30);
    console.timeEnd('Chart Data Generation');
    
    console.log('📈 Chart Performance:', {
      dataPoints: chartData.length,
      timespan: '30 days'
    });
  }
};

// Run all tests
export const runAllTests = () => {
  console.log('🧪 Running Uptime Dashboard Tests...\n');
  
  // Data generation tests
  console.log('📊 Testing Data Generation:');
  const monitors = testFunctions.testGenerateDummyMonitors();
  testFunctions.testGenerateDashboardMetrics(monitors);
  testFunctions.testGenerateUptimeHistory('test-monitor', 7);
  
  // Filtering tests
  console.log('\n🔍 Testing Filtering:');
  testFunctions.testFilterMonitors(testScenarios.mixedStatusMonitors, 'all');
  testFunctions.testFilterMonitors(testScenarios.mixedStatusMonitors, 'up');
  testFunctions.testFilterMonitors(testScenarios.mixedStatusMonitors, 'down');
  
  // Edge case tests
  console.log('\n⚠️ Testing Edge Cases:');
  const edgeResults = testFunctions.testEdgeCases();
  console.log('Edge case results:', edgeResults);
  
  // Time formatting tests
  console.log('\n⏰ Testing Time Formatting:');
  testFunctions.testRelativeTime();
  
  // Performance tests
  console.log('\n⚡ Testing Performance:');
  performanceTests.testLargeDataset();
  performanceTests.testChartPerformance();
  
  // Accessibility reminders
  console.log('\n♿ Accessibility Tests (Manual):');
  accessibilityTests.testKeyboardNavigation();
  accessibilityTests.testScreenReader();
  accessibilityTests.testColorContrast();
  
  console.log('\n✅ Test suite completed!');
};