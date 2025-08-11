import Link from "next/link";
import { ThemeToggle } from "web/components/theme-toggle";

import { Button } from "web/components/ui/button";
import { generateDummyMonitors, generateDashboardMetrics, generateUptimeHistoryForChart } from "web/lib/dummy-data";
import { Plus } from "lucide-react";
import DashBoardMain from "web/components/dashboard";

export default async function Home() {
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold truncate">Uptime Monitor</h1>
            <p className="text-muted-foreground text-sm hidden sm:block">Dashboard Overview</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/monitors/add">
              <Button size="sm" className="sm:size-default">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Monitor</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <DashBoardMain  />
    </div>
  );
}
