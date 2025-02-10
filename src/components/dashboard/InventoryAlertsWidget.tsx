
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PackageCheck } from "lucide-react"

export const InventoryAlertsWidget = () => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4" />
            Inventory Alerts
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">8 Low Stock Items</span>
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Warning</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">3 Out of Stock</span>
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
