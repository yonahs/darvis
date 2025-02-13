import { format } from "date-fns"
import { CheckCircle, XCircle } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface OrderSummaryProps {
  order: Order | null
}

export const OrderSummaryCard = ({ order }: OrderSummaryProps) => {
  if (!order) return null

  return (
    <Card className="h-[64px] border-0">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base font-medium text-primary">Order #{order.orderid}</CardTitle>
            <p className="text-xs text-muted-foreground/80">
              {order.orderdate && format(new Date(order.orderdate), "PPP")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {order.cancelled ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}