
import { SlackAlertsWidget } from "@/components/dashboard/SlackAlertsWidget"
import { TrustpilotCard } from "@/components/dashboard/TrustpilotCard"
import { ClientStats } from "@/components/dashboard/ClientStats"
import { RecentOrdersWidget } from "@/components/dashboard/RecentOrdersWidget"
import { PrescriptionAlertsWidget } from "@/components/dashboard/PrescriptionAlertsWidget"
import { ShipperOrdersWidget } from "@/components/dashboard/ShipperOrdersWidget"
import { FinancialOverviewWidget } from "@/components/dashboard/FinancialOverviewWidget"
import { InventoryAlertsWidget } from "@/components/dashboard/InventoryAlertsWidget"

const Index = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Top section - full width */}
          <SlackAlertsWidget />
          
          {/* Two small widgets side by side */}
          <div className="grid grid-cols-2 gap-4">
            <ClientStats />
            <PrescriptionAlertsWidget />
          </div>
          
          {/* Full width widget */}
          <ShipperOrdersWidget />
          
          {/* Full width widget */}
          <InventoryAlertsWidget />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Full width in right column */}
          <TrustpilotCard />
          
          {/* Full width widget */}
          <RecentOrdersWidget />
          
          {/* Full width widget */}
          <FinancialOverviewWidget />
        </div>
      </div>
    </div>
  )
}

export default Index
