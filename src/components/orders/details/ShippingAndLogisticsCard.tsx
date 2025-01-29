import { Truck, Package, Check, ArrowRight, MapPin } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface ShippingAndLogisticsProps {
  order: Order | null
  onMarkAsShipped: () => void
}

export const ShippingAndLogisticsCard = ({ order, onMarkAsShipped }: ShippingAndLogisticsProps) => {
  if (!order) return null

  const handleChangeAddress = () => {
    console.log("Change shipping address clicked for order:", order.orderid)
  }

  const handleChangeShipper = () => {
    console.log("Change shipper clicked for order:", order.orderid)
  }

  const steps = [
    { id: 1, label: "Order Placed", icon: Package },
    { id: 2, label: "Processing", icon: ArrowRight },
    { id: 3, label: "Shipped", icon: Check },
  ]

  const currentStep = order.shipstatus || 1

  return (
    <Card>
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs font-medium text-primary/80 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Shipping & Logistics
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button onClick={handleChangeAddress} variant="outline" size="xs" className="h-6 px-2 text-xs gap-1">
              <MapPin className="h-3 w-3" />
              Change Address
            </Button>
            <Button onClick={handleChangeShipper} variant="outline" size="xs" className="h-6 px-2 text-xs gap-1">
              <Truck className="h-3 w-3" />
              Change Shipper
            </Button>
            <Button onClick={onMarkAsShipped} variant="outline" size="xs" className="h-6 px-2 text-xs gap-1">
              <Check className="h-3 w-3" />
              Mark Shipped
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-2">
        <div className="relative">
          <div className="flex justify-between mb-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <step.icon className="h-3 w-3 mb-1" />
                <span className="text-xs">{step.label}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="space-y-1 pt-2 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{order.shipstatus ? String(order.shipstatus) : "Not shipped"}</span>
          </div>
          {order.sentdate && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Sent Date</span>
              <span>{format(new Date(order.sentdate), "PPp")}</span>
            </div>
          )}
          {order.ups && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Tracking #</span>
              <span className="font-medium">{order.ups}</span>
            </div>
          )}
        </div>

        <div className="space-y-1 pt-2 border-t">
          <p className="text-xs font-medium">Shipping Address:</p>
          <p className="text-xs text-muted-foreground">
            {order.address}
            {order.address2 && <br />}
            {order.address2}
            <br />
            {order.city}, {order.state} {order.zip}
            <br />
            {order.country}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}