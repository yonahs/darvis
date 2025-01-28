import { OrderItemsCard } from "./OrderItemsCard"
import { ShippingDetailsCard } from "./ShippingDetailsCard"
import { CommentsCard } from "./CommentsCard"
import { ServiceNotes } from "./ServiceNotes"
import { LogisticsTimeline } from "./LogisticsTimeline"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]
type DrugDetails = Database["public"]["Tables"]["newdrugdetails"]["Row"]
type Comment = Database["public"]["Tables"]["ordercomments"]["Row"]

interface OrderDetailsContentProps {
  order: Order | null
  drugDetails: DrugDetails | null
  comments: Comment[] | null
  onMarkAsShipped: () => void
}

export const OrderDetailsContent = ({
  order,
  drugDetails,
  comments,
  onMarkAsShipped,
}: OrderDetailsContentProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left Column */}
      <div className="space-y-4">
        <OrderItemsCard drugDetails={drugDetails} />
        <LogisticsTimeline 
          status={{ id: order?.shipstatus || 1, shipstatus: order?.shipstatus ? String(order.shipstatus) : "Not shipped" }}
          lastUpdate={order?.sentdate}
          trackingNumber={order?.ups}
        />
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <ShippingDetailsCard order={order} onMarkAsShipped={onMarkAsShipped} />
        <ServiceNotes orderId={order?.orderid || 0} />
        <CommentsCard comments={comments} />
      </div>
    </div>
  )
}