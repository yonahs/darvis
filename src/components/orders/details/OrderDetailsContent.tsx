
import { OrderItemsCard } from "./OrderItemsCard"
import { ShippingAndLogisticsCard } from "./ShippingAndLogisticsCard"
import { FinancialDetailsCard } from "./FinancialDetailsCard"
import { ClientDetailsCard } from "./ClientDetailsCard"
import { PrescriptionManagementCard } from "./PrescriptionManagementCard"
import { CommentsCard } from "./CommentsCard"
import { OrderDetailsGrid } from "./OrderDetailsGrid"
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
  allOrderItems?: Order[] | null
}

export const OrderDetailsContent = ({
  order,
  client,
  drugDetails,
  comments,
  onMarkAsShipped,
  onMarkAsPaid,
  allOrderItems,
}: OrderDetailsContentProps) => {
  console.log("OrderDetailsContent - Full order object:", order)
  console.log("OrderDetailsContent - Shipper ID:", order?.shipperid)
  console.log("OrderDetailsContent - Shipping status:", order?.shipstatus)

  return (
    <OrderDetailsGrid>
      <div className="col-span-1 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm overflow-auto">
            <ClientDetailsCard client={client} />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-auto">
            <FinancialDetailsCard order={order} onMarkAsPaid={onMarkAsPaid} />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg shadow-sm overflow-auto">
          <OrderItemsCard drugDetails={drugDetails} order={order} allOrderItems={allOrderItems} />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-auto">
          <ShippingAndLogisticsCard order={order} onMarkAsShipped={onMarkAsShipped} />
        </div>
      </div>

      <div className="col-span-1 space-y-4">
        <div className="bg-white rounded-lg shadow-sm overflow-auto">
          <PrescriptionManagementCard order={order} drugDetails={drugDetails} />
        </div>

        <div className="bg-purple-100 rounded-lg shadow-sm overflow-auto">
          <CommentsCard comments={comments} orderId={order?.orderid || 0} />
        </div>
      </div>
    </OrderDetailsGrid>
  )
}
