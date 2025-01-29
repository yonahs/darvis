import { CreditCard, DollarSign, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface FinancialDetailsProps {
  order: Order | null
  onMarkAsPaid: () => void
}

export const FinancialDetailsCard = ({ order, onMarkAsPaid }: FinancialDetailsProps) => {
  if (!order) return null

  const paymentEvents = [
    {
      date: order.orderdate,
      status: "Order Created",
      amount: order.totalsale
    },
    ...(order.orderbilled ? [{
      date: order.achsubmitted,
      status: "Payment Processed",
      amount: order.totalsale
    }] : [])
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs font-medium text-primary/80 flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Financial Details
          </CardTitle>
          <Button onClick={onMarkAsPaid} variant="outline" size="xs" className="h-6 px-2 text-xs gap-1">
            <CreditCard className="h-3 w-3" />
            Mark as Paid
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-2">
        <div className="space-y-0.5 text-xs">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.usprice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{formatCurrency(order.shippingprice)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>{formatCurrency(order.totalsale)}</span>
          </div>
        </div>
        
        <div className="border-t pt-2">
          <div className="flex items-center gap-1 text-xs font-medium mb-1">
            <Clock className="h-3 w-3" />
            <span>Payment Timeline</span>
          </div>
          <div className="space-y-1">
            {paymentEvents.map((event, index) => (
              <div key={index} className="text-xs flex justify-between items-start">
                <div className="space-y-0.5">
                  <div className="font-medium">{event.status}</div>
                  <div className="text-muted-foreground">
                    {event.date && format(new Date(event.date), "MMM d, yyyy")}
                  </div>
                </div>
                <span className="text-muted-foreground">
                  {formatCurrency(event.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}