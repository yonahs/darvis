import { CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface FinancialDetailsProps {
  order: Order | null
  onMarkAsPaid: () => void
}

export const FinancialDetailsCard = ({ order, onMarkAsPaid }: FinancialDetailsProps) => {
  if (!order) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-primary/80">Financial Details</CardTitle>
          <Button onClick={onMarkAsPaid} variant="outline" size="xs">
            <CreditCard className="h-4 w-4 mr-2" />
            Mark as Paid
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(order.usprice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>{formatCurrency(order.shippingprice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total:</span>
          <span className="font-bold">{formatCurrency(order.totalsale)}</span>
        </div>
      </CardContent>
    </Card>
  )
}