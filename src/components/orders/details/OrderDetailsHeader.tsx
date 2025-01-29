import { OrderSummaryCard } from "./OrderSummaryCard"
import { OrderStatusBadge } from "./OrderStatusBadge"
import { Button } from "@/components/ui/button"
import { 
  AlertCircle, 
  ShieldCheck, 
  ArrowUp, 
  Percent, 
  Plus,
  Truck,
  Signature,
  Calendar,
  Combine
} from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"
import { Card, CardContent } from "@/components/ui/card"

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface OrderDetailsHeaderProps {
  order: Order | null
  onEscalate?: () => void
}

export const OrderDetailsHeader = ({ order, onEscalate }: OrderDetailsHeaderProps) => {
  const handleEscalate = async () => {
    if (!order?.orderid) return

    try {
      const { error: commentError } = await supabase
        .from("ordercomments")
        .insert({
          id: Date.now(),
          orderid: order.orderid,
          comment: "Order has been escalated to customer service",
          author: "Customer Service",
          commentdate: new Date().toISOString(),
          deleteable: true,
          showonreadyshipping: false
        })

      if (commentError) throw commentError
      toast.warning("Order has been escalated to customer service")
      if (onEscalate) onEscalate()
    } catch (error) {
      console.error("Error escalating order:", error)
      toast.error("Failed to escalate order")
    }
  }

  const handleDeescalate = async () => {
    if (!order?.orderid) return

    try {
      const { error: commentError } = await supabase
        .from("ordercomments")
        .insert({
          id: Date.now(),
          orderid: order.orderid,
          comment: "Order has been de-escalated",
          author: "Customer Service",
          commentdate: new Date().toISOString(),
          deleteable: true,
          showonreadyshipping: false
        })

      if (commentError) throw commentError
      toast.success("Order has been de-escalated")
    } catch (error) {
      console.error("Error de-escalating order:", error)
      toast.error("Failed to de-escalate order")
    }
  }

  const handleRushOrder = () => {
    toast.info("Order marked as rush order")
  }

  const handleDiscount = () => {
    toast.info("Add discount functionality coming soon")
  }

  const handleExtraCharge = () => {
    toast.info("Add extra charge functionality coming soon")
  }

  const handleChangeShipper = () => {
    toast.info("Change shipper functionality coming soon")
  }

  const handleSignatureRequired = () => {
    toast.info("Signature requirement updated")
  }

  const handleDelayShipDate = () => {
    toast.info("Delay ship date functionality coming soon")
  }

  const handleCombineOrder = () => {
    toast.info("Combine order functionality coming soon")
  }

  return (
    <div className="mb-6">
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Order #{order?.orderid}</h2>
                  <OrderStatusBadge order={order} onEscalate={handleEscalate} />
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(order?.orderdate || "").toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-1.5">
              <Button
                onClick={handleEscalate}
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Escalate
              </Button>
              <Button
                onClick={handleDeescalate}
                variant="outline"
                size="sm"
                className="text-success hover:text-success hover:bg-success/10"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                De-escalate
              </Button>
              <Button
                onClick={handleRushOrder}
                variant="outline"
                size="sm"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Rush
              </Button>
              <Button
                onClick={handleDiscount}
                variant="outline"
                size="sm"
              >
                <Percent className="h-4 w-4 mr-2" />
                Discount
              </Button>
              <Button
                onClick={handleExtraCharge}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Extra
              </Button>
              <Button
                onClick={handleChangeShipper}
                variant="outline"
                size="sm"
              >
                <Truck className="h-4 w-4 mr-2" />
                Shipper
              </Button>
              <Button
                onClick={handleSignatureRequired}
                variant="outline"
                size="sm"
              >
                <Signature className="h-4 w-4 mr-2" />
                Sign
              </Button>
              <Button
                onClick={handleDelayShipDate}
                variant="outline"
                size="sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Delay
              </Button>
              <Button
                onClick={handleCombineOrder}
                variant="outline"
                size="sm"
              >
                <Combine className="h-4 w-4 mr-2" />
                Combine
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}