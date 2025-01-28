import { Truck, Package, Check, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]
type TrackingStatus = Database["public"]["Tables"]["trackingstatus"]["Row"]

interface ShippingAndLogisticsProps {
  order: Order | null
  onMarkAsShipped: () => void
}

export const ShippingAndLogisticsCard = ({ order, onMarkAsShipped }: ShippingAndLogisticsProps) => {
  if (!order) return null

  const steps = [
    { id: 1, label: "Order Placed", icon: Package },
    { id: 2, label: "Processing", icon: ArrowRight },
    { id: 3, label: "Shipped", icon: Check },
  ]

  const currentStep = order.shipstatus || 1

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipping & Logistics
          </CardTitle>
          <Button onClick={onMarkAsShipped} variant="outline" size="sm">
            <Truck className="h-4 w-4 mr-2" />
            Mark as Shipped
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline */}
        <div className="relative">
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <step.icon className="h-4 w-4 mb-2" />
                <span className="text-xs">{step.label}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Shipping Details */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground text-sm">Status</span>
            <span className="text-sm font-medium">{order.shipstatus ? String(order.shipstatus) : "Not shipped"}</span>
          </div>
          {order.sentdate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground text-sm">Sent Date</span>
              <span className="text-sm">{format(new Date(order.sentdate), "PPp")}</span>
            </div>
          )}
          {order.ups && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground text-sm">Tracking #</span>
              <span className="text-sm font-medium">{order.ups}</span>
            </div>
          )}
        </div>

        {/* Address Details */}
        <div className="space-y-1 pt-4 border-t">
          <p className="text-sm font-medium">Shipping Address:</p>
          <p className="text-sm text-muted-foreground">
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