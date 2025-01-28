import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface OrderStatusBadgeProps {
  order: Order | null
  onEscalate: () => void
}

export const OrderStatusBadge = ({ order, onEscalate }: OrderStatusBadgeProps) => {
  if (!order) return null

  const handleEscalate = () => {
    console.log("Escalating order:", order.orderid)
    toast.warning("Order has been escalated to customer service")
    onEscalate()
  }

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
      <Button
        onClick={handleEscalate}
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <AlertCircle className="h-4 w-4" />
      </Button>
    </div>
  )
}