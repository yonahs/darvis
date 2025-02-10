
import { Badge } from "@/components/ui/badge"
import { Clock, Truck } from "lucide-react"

interface ShippingStatusBadgeProps {
  status: number
}

export const ShippingStatusBadge = ({ status }: ShippingStatusBadgeProps) => {
  switch (status) {
    case 2:
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <Truck className="h-3 w-3" /> Shipped
        </Badge>
      )
    case 1:
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Processing
        </Badge>
      )
    default:
      return <Badge variant="secondary">Not Started</Badge>
  }
}
