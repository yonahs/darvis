import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, HelpCircle } from "lucide-react"
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

  const getStatusDetails = (status: number) => {
    switch (status) {
      case 1:
        return {
          label: "Pending",
          variant: "new" as const,
          icon: Clock
        }
      case 2:
        return {
          label: "Processing",
          variant: "success" as const,
          icon: CheckCircle2
        }
      case 3:
        return {
          label: "Shipped",
          variant: "default" as const,
          icon: CheckCircle2
        }
      default:
        return {
          label: "Processing",
          variant: "secondary" as const,
          icon: HelpCircle
        }
    }
  }

  const statusDetails = getStatusDetails(order.status || 0)

  return (
    <div className="flex items-center gap-2">
      <Badge variant={statusDetails.variant} className="flex items-center gap-1.5 py-1">
        <statusDetails.icon className="h-3.5 w-3.5" />
        {statusDetails.label}
      </Badge>
      {order.problemorder && (
        <Button
          onClick={handleEscalate}
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <AlertCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}