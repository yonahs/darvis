import { useState, useEffect } from "react"
import { OrderItemsCard } from "./OrderItemsCard"
import { ShippingAndLogisticsCard } from "./ShippingAndLogisticsCard"
import { FinancialDetailsCard } from "./FinancialDetailsCard"
import { ClientDetailsCard } from "./ClientDetailsCard"
import { PrescriptionManagementCard } from "./PrescriptionManagementCard"
import { CommentsCard } from "./CommentsCard"
import { OrderDetailsGrid } from "./OrderDetailsGrid"
import { defaultLayouts } from "./gridLayouts"
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

  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem("orderDetailsLayouts")
    return savedLayouts ? JSON.parse(savedLayouts) : defaultLayouts
  })

  const handleLayoutChange = (_: any, allLayouts: any) => {
    setLayouts(allLayouts)
    localStorage.setItem("orderDetailsLayouts", JSON.stringify(allLayouts))
  }

  useEffect(() => {
    const savedLayouts = localStorage.getItem("orderDetailsLayouts")
    if (savedLayouts) {
      setLayouts(JSON.parse(savedLayouts))
    }
  }, [])

  return (
    <OrderDetailsGrid layouts={layouts} onLayoutChange={handleLayoutChange}>
      <div key="client" className="bg-white rounded-lg shadow-sm overflow-auto">
        <ClientDetailsCard client={client} />
      </div>
      
      <div key="shipping" className="bg-white rounded-lg shadow-sm overflow-auto">
        <ShippingAndLogisticsCard order={order} onMarkAsShipped={onMarkAsShipped} />
      </div>
      
      <div key="financial" className="bg-white rounded-lg shadow-sm overflow-auto">
        <FinancialDetailsCard order={order} onMarkAsPaid={onMarkAsPaid} />
      </div>

      <div key="orderItems" className="bg-white rounded-lg shadow-sm overflow-auto">
        <OrderItemsCard drugDetails={drugDetails} order={order} allOrderItems={allOrderItems} />
      </div>

      <div key="prescription" className="bg-white rounded-lg shadow-sm overflow-auto">
        <PrescriptionManagementCard order={order} drugDetails={drugDetails} />
      </div>

      <div key="comments" className="bg-white rounded-lg shadow-sm overflow-auto">
        <CommentsCard comments={comments} orderId={order?.orderid || 0} />
      </div>
    </OrderDetailsGrid>
  )
}