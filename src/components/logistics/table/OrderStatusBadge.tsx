
import { Badge } from "@/components/ui/badge"
import { Clock, Upload } from "lucide-react"

interface OrderStatusBadgeProps {
  status: number
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  switch (status) {
    case 2:
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <Upload className="h-3 w-3" /> Uploaded
        </Badge>
      )
    case 1:
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      )
    default:
      return <Badge variant="secondary">Processing</Badge>
  }
}
