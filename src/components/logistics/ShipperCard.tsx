
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package2, Upload, Clock, ArrowUpRight } from "lucide-react"

interface ShipperCardProps {
  name: string
  totalOrders: number
  uploaded: number
  notUploaded: number
  onClick?: () => void
}

export const ShipperCard = ({ 
  name, 
  totalOrders, 
  uploaded, 
  notUploaded,
  onClick 
}: ShipperCardProps) => {
  const progress = totalOrders > 0 ? (uploaded / totalOrders) * 100 : 0

  return (
    <Card 
      className="group hover:border-primary/50 transition-colors cursor-pointer relative"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package2 className="h-4 w-4 text-muted-foreground" />
            {name}
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
      </CardContent>
    </Card>
  )
}
