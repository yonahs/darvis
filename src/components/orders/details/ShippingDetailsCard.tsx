import { Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface ShippingDetailsProps {
  order: Order | null
  onMarkAsShipped: () => void
}

export const ShippingDetailsCard = ({ order, onMarkAsShipped }: ShippingDetailsProps) => {
  if (!order) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Shipping Details</CardTitle>
          <Button onClick={onMarkAsShipped} variant="outline" size="sm">
            <Truck className="h-4 w-4 mr-2" />
            Mark as Shipped
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Tracking: {order.ups || "Not available"}</p>
        <p>Status: {order.shipstatus || "Not shipped"}</p>
        <p>
          {order.address}
          {order.address2 && <br />}
          {order.address2}
          <br />
          {order.city}, {order.state} {order.zip}
          <br />
          {order.country}
        </p>
      </CardContent>
    </Card>
  )
}