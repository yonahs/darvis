
import { CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentCardProps {
  lifetimeValue: number
  orderCount: number
}

export function PaymentCard({ lifetimeValue, orderCount }: PaymentCardProps) {
  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Lifetime Value</p>
            <p className="text-xl font-semibold">${lifetimeValue.toFixed(2) || "0.00"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-xl font-semibold">{orderCount || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
