
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package2, Upload, Clock, ArrowUpRight, AlertTriangle, Plane, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShipperCardProps {
  name: string
  totalOrders: number
  uploaded: number
  notUploaded: number
  rushOrders: number
  outOfStock: number
  internationalOrders: number
  avgShippingCost: number
  isInternational: boolean
  onClick?: () => void
}

export const ShipperCard = ({ 
  name, 
  totalOrders, 
  uploaded, 
  notUploaded,
  rushOrders,
  outOfStock,
  internationalOrders,
  avgShippingCost,
  isInternational,
  onClick 
}: ShipperCardProps) => {
  const progress = totalOrders > 0 ? (uploaded / totalOrders) * 100 : 0

  return (
    <Card 
      className={cn(
        "group hover:border-primary/50 transition-colors cursor-pointer relative",
        isInternational && "border-blue-200"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package2 className="h-4 w-4 text-muted-foreground" />
            {name}
            {isInternational && (
              <Plane className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending Orders
          </span>
          <span className="font-medium">{totalOrders}</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Upload className="h-3 w-3" />
              Uploaded
            </span>
            <span className="font-medium">{uploaded}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-medium text-orange-500">{notUploaded}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {rushOrders > 0 && (
            <div className="flex items-center gap-1 text-red-500">
              <Clock className="h-3 w-3" />
              {rushOrders} Rush
            </div>
          )}
          {outOfStock > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <AlertTriangle className="h-3 w-3" />
              {outOfStock} Stock
            </div>
          )}
          {internationalOrders > 0 && (
            <div className="flex items-center gap-1 text-blue-500">
              <Plane className="h-3 w-3" />
              {internationalOrders} Int'l
            </div>
          )}
          <div className="flex items-center gap-1 text-green-600">
            <DollarSign className="h-3 w-3" />
            ${avgShippingCost.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
