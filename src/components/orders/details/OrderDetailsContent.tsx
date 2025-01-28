import { OrderItemsCard } from "./OrderItemsCard"
import { ShippingDetailsCard } from "./ShippingDetailsCard"
import { CommentsCard } from "./CommentsCard"
import { ServiceNotes } from "./ServiceNotes"
import { LogisticsTimeline } from "./LogisticsTimeline"
import { FinancialDetailsCard } from "./FinancialDetailsCard"
import { ClientDetailsCard } from "./ClientDetailsCard"
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

type Order = Database["public"]["Tables"]["orders"]["Row"]
type DrugDetails = Database["public"]["Tables"]["newdrugdetails"]["Row"]
type Comment = Database["public"]["Tables"]["ordercomments"]["Row"]
type Client = Database["public"]["Tables"]["clients"]["Row"]

interface OrderDetailsContentProps {
  order: Order | null
  client: Client | null
  drugDetails: DrugDetails | null
  comments: Comment[] | null
  onMarkAsShipped: () => void
  onMarkAsPaid: () => void
}

export const OrderDetailsContent = ({
  order,
  client,
  drugDetails,
  comments,
  onMarkAsShipped,
  onMarkAsPaid,
}: OrderDetailsContentProps) => {
  console.log("Rendering OrderDetailsContent with order:", order)
  console.log("Drug details:", drugDetails)
  console.log("Comments:", comments)

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
    <div className="grid grid-cols-3 gap-4">
      {/* Left Column - Order Information */}
      <div className="space-y-4">
        <OrderItemsCard drugDetails={drugDetails} />
        <LogisticsTimeline 
          status={{ id: order?.shipstatus || 1, shipstatus: order?.shipstatus ? String(order.shipstatus) : "Not shipped" }}
          lastUpdate={order?.sentdate}
          trackingNumber={order?.ups}
        />
        <ClientDetailsCard client={client} />
      </div>

      {/* Middle Column - Financial and Shipping */}
      <div className="space-y-4">
        <ShippingDetailsCard order={order} onMarkAsShipped={onMarkAsShipped} />
        <FinancialDetailsCard order={order} onMarkAsPaid={onMarkAsPaid} />
      </div>

      {/* Right Column - Actions and Communication */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="font-medium mb-4">Order Actions</h3>
          <div className="space-y-2">
            <Button
              onClick={handleEscalate}
              variant="outline"
              size="sm"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Escalate Order
            </Button>
            <Button
              onClick={handleDeescalate}
              variant="outline"
              size="sm"
              className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              De-escalate Order
            </Button>
            <Button
              onClick={handleRushOrder}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Rush Order
            </Button>
            <Button
              onClick={handleDiscount}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Percent className="h-4 w-4 mr-2" />
              Add Discount
            </Button>
            <Button
              onClick={handleExtraCharge}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Extra Charge
            </Button>
            <Button
              onClick={handleChangeShipper}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Truck className="h-4 w-4 mr-2" />
              Change Shipper
            </Button>
            <Button
              onClick={handleSignatureRequired}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Signature className="h-4 w-4 mr-2" />
              Signature Required
            </Button>
            <Button
              onClick={handleDelayShipDate}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Delay Ship Date
            </Button>
            <Button
              onClick={handleCombineOrder}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Combine className="h-4 w-4 mr-2" />
              Combine Order
            </Button>
          </div>
        </div>
        <ServiceNotes orderId={order?.orderid || 0} />
        <CommentsCard comments={comments} />
      </div>
    </div>
  )
}