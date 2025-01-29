import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ShipperStats {
  shipperid: number
  name: string
  totalOrders: number
  uploaded: number
  notUploaded: number
}

interface ShipperCardProps {
  shipper: ShipperStats
  onViewOrders: (uploaded: boolean) => void
}

export const ShipperCard = ({ shipper, onViewOrders }: ShipperCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-bold">{shipper.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {shipper.totalOrders} orders pending
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-muted-foreground">Uploaded</span>
              <span className="ml-2 text-green-600">{shipper.uploaded}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Not Uploaded</span>
              <span className="ml-2 text-orange-600">{shipper.notUploaded}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-1.5 mt-3">
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full bg-blue-50 hover:bg-blue-100 text-xs"
              onClick={() => onViewOrders(true)}
            >
              View Uploaded
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full bg-blue-50 hover:bg-blue-100 text-xs"
              onClick={() => onViewOrders(false)}
            >
              View Pending
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export const ShipperCardSkeleton = () => (
  <Card className="shadow-sm">
    <CardHeader className="space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
    </CardContent>
  </Card>
)