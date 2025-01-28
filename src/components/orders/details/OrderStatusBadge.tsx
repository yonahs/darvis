import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface OrderStatusBadgeProps {
  order: Order | null
  onEscalate: () => void
}

export const OrderStatusBadge = ({ order, onEscalate }: OrderStatusBadgeProps) => {
  if (!order) return null

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return "bg-yellow-500"
      case 2: return "bg-green-500"
      case 3: return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className={getStatusColor(order.status || 0)}>
        {order.status === 1 ? "Pending" : 
         order.status === 2 ? "Processing" :
         order.status === 3 ? "Shipped" : "Unknown"}
      </Badge>
      <button
        onClick={onEscalate}
        className="p-1 hover:bg-gray-100 rounded-full"
        title="Escalate Order"
      >
        <AlertCircle className="h-4 w-4 text-red-500" />
      </button>
    </div>
  )
}