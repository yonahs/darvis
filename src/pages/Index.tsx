
import { SlackAlertsWidget } from "@/components/dashboard/SlackAlertsWidget"
import { TrustpilotCard } from "@/components/dashboard/TrustpilotCard"
import { ClientStats } from "@/components/dashboard/ClientStats"
import { RecentOrdersWidget } from "@/components/dashboard/RecentOrdersWidget"
import { PrescriptionAlertsWidget } from "@/components/dashboard/PrescriptionAlertsWidget"
import { ShipperOrdersWidget } from "@/components/dashboard/ShipperOrdersWidget"
import { FinancialOverviewWidget } from "@/components/dashboard/FinancialOverviewWidget"
import { InventoryAlertsWidget } from "@/components/dashboard/InventoryAlertsWidget"
import { TeamActivityWidget } from "@/components/dashboard/TeamActivityWidget"

const Index = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* First row - 2 columns */}
        <div className="lg:col-span-2">
          <SlackAlertsWidget />
        </div>
        <div className="lg:col-span-2">
          <TrustpilotCard />
        </div>
        
        {/* Second row - mixed layout */}
        <div className="lg:col-span-1">
          <ClientStats />
        </div>
        <div className="lg:col-span-2">
          <RecentOrdersWidget />
        </div>
        <div className="lg:col-span-1">
          <PrescriptionAlertsWidget />
        </div>
        
        {/* Third row - balanced layout */}
        <div className="lg:col-span-2">
          <ShipperOrdersWidget />
        </div>
        <div className="lg:col-span-2">
          <FinancialOverviewWidget />
        </div>
        
        {/* Fourth row - mixed layout */}
        <div className="lg:col-span-3">
          <InventoryAlertsWidget />
        </div>
        <div className="lg:col-span-1">
          <TeamActivityWidget />
        </div>
      </div>
    </div>
  )
}

export default Index
