
import { useShipperStats } from "@/hooks/useShipperStats"
import { ShipperCard } from "@/components/logistics/ShipperCard"
import { OrdersDialog } from "@/components/logistics/OrdersDialog"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Package2, Upload, Clock, AlertTriangle } from "lucide-react"

const Logistics = () => {
  const { data: shipperStats, isLoading } = useShipperStats()
  const [selectedShipperId, setSelectedShipperId] = useState<number | null>(null)

  // Calculate totals
  const totals = shipperStats?.reduce(
    (acc, curr) => ({
      orders: acc.orders + curr.totalOrders,
      uploaded: acc.uploaded + curr.uploaded,
      notUploaded: acc.notUploaded + curr.notUploaded,
    }),
    { orders: 0, uploaded: 0, notUploaded: 0 }
  )

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Logistics</h1>
      </div>

      {/* Overview Cards */}
      {!isLoading && totals && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Package2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold">{totals.orders}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Upload className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Uploaded</p>
                    <p className="text-2xl font-bold">{totals.uploaded}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pending Upload</p>
                    <p className="text-2xl font-bold">{totals.notUploaded}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
        isOpen={!!selectedShipperId}
        onOpenChange={() => setSelectedShipperId(null)}
        shipperId={selectedShipperId}
      />
    </div>
  )
}

export default Logistics
