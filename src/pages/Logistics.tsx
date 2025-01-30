import { useShipperStats } from "@/hooks/useShipperStats"
import { ShipperCard } from "@/components/logistics/ShipperCard"
import { OrdersDialog } from "@/components/logistics/OrdersDialog"
import { useState } from "react"

const Logistics = () => {
  const { data: shipperStats, isLoading } = useShipperStats()
  const [selectedShipperId, setSelectedShipperId] = useState<number | null>(null)

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Logistics</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[180px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : shipperStats?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No active shippers</h3>
          <p className="text-muted-foreground">
            There are no shippers with pending orders at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {shipperStats?.map((stats) => (
            <ShipperCard
              key={stats.shipperid}
              name={stats.name}
              totalOrders={stats.totalOrders}
              uploaded={stats.uploaded}
              notUploaded={stats.notUploaded}
              onClick={() => setSelectedShipperId(stats.shipperid)}
            />
          ))}
        </div>
      )}

      <OrdersDialog
        open={!!selectedShipperId}
        onOpenChange={() => setSelectedShipperId(null)}
        shipperId={selectedShipperId}
      />
    </div>
  )
}

export default Logistics