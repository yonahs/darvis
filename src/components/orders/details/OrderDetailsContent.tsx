import { OrderItemsCard } from "./OrderItemsCard"
import { ShippingDetailsCard } from "./ShippingDetailsCard"
import { CommentsCard } from "./CommentsCard"
import { ServiceNotes } from "./ServiceNotes"
import { LogisticsTimeline } from "./LogisticsTimeline"
import { FinancialDetailsCard } from "./FinancialDetailsCard"
import { ClientDetailsCard } from "./ClientDetailsCard"
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

      {/* Right Column - Communication */}
      <div className="space-y-4">
        <ServiceNotes orderId={order?.orderid || 0} />
        <CommentsCard comments={comments} />
      </div>
    </div>
  )
}