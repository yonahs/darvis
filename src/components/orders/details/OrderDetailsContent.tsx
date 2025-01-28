import { OrderItemsCard } from "./OrderItemsCard"
import { ShippingDetailsCard } from "./ShippingDetailsCard"
import { CommentsCard } from "./CommentsCard"
import { ServiceNotes } from "./ServiceNotes"
import { LogisticsTimeline } from "./LogisticsTimeline"
import { FinancialDetailsCard } from "./FinancialDetailsCard"
import { ClientDetailsCard } from "./ClientDetailsCard"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
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
          </div>
        </div>
        <ServiceNotes orderId={order?.orderid || 0} />
        <CommentsCard comments={comments} />
      </div>
    </div>
  )
}