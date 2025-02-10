
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
        <div className="col-span-1">
          <SlackAlertsWidget />
        </div>
        <div className="col-span-1">
          <TrustpilotCard />
        </div>
        <ClientStats />
        <RecentOrdersWidget />
        <PrescriptionAlertsWidget />
        <ShipperOrdersWidget />
        <FinancialOverviewWidget />
        <InventoryAlertsWidget />
        <TeamActivityWidget />
      </div>
    </div>
  )
}

export default Index
