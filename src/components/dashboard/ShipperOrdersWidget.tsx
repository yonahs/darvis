
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"

export const ShipperOrdersWidget = () => {
  // Static mock data for development/testing
  const shipperOrders = [
    { name: "Pharma Shaul", count: 12 },
    { name: "Leading Up", count: 8 },
    { name: "SUBS 2", count: 6 },
    { name: "Aktive", count: 4 },
    { name: "FedEx", count: 3 }
  ]

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Pending Orders by Shipper
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {shipperOrders.map((shipper) => (
            <div key={shipper.name} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{shipper.name}</span>
              <span className="text-sm font-bold">{shipper.count}</span>
            </div>
          ))}
          {shipperOrders.length === 0 && (
            <div className="text-sm text-muted-foreground">No pending orders</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
