import MainCard from "web/components/site-monitoring/main-card";
import StatusBar from "web/components/site-monitoring/status-bar";
import StatusChart from "web/components/site-monitoring/status-chart";

// Main MonitorPage Component
export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            System Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your services and infrastructure health
          </p>
        </div>
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Bar - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <StatusBar status="up" />
          </div>
          
          {/* Main Stats Card - Takes 1 column */}
          <div>
            <MainCard 
              uptime="100%" 
              restime="95ms"
              title="Primary Service"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
          <StatusChart />
        </div>
        
      </div>
    </div>
  );
}