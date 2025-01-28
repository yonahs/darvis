import { useState } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { OrderItemsCard } from "./OrderItemsCard"
import { ShippingAndLogisticsCard } from "./ShippingAndLogisticsCard"
import { CommentsCard } from "./CommentsCard"
import { ServiceNotes } from "./ServiceNotes"
import { FinancialDetailsCard } from "./FinancialDetailsCard"
import { ClientDetailsCard } from "./ClientDetailsCard"
import type { Database } from "@/integrations/supabase/types"

const ResponsiveGridLayout = WidthProvider(Responsive)

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
  const [layouts] = useState({
    lg: [
      { i: "client", x: 0, y: 0, w: 4, h: 2 },
      { i: "shipping", x: 4, y: 0, w: 4, h: 3 },
      { i: "financial", x: 8, y: 0, w: 4, h: 2 },
      { i: "orderItems", x: 0, y: 2, w: 4, h: 3 },
      { i: "serviceNotes", x: 8, y: 2, w: 4, h: 3 },
      { i: "comments", x: 0, y: 5, w: 12, h: 3 },
    ],
    md: [
      { i: "client", x: 0, y: 0, w: 4, h: 2 },
      { i: "shipping", x: 4, y: 0, w: 4, h: 3 },
      { i: "financial", x: 8, y: 0, w: 4, h: 2 },
      { i: "orderItems", x: 0, y: 2, w: 4, h: 3 },
      { i: "serviceNotes", x: 8, y: 2, w: 4, h: 3 },
      { i: "comments", x: 0, y: 5, w: 12, h: 3 },
    ],
    sm: [
      { i: "client", x: 0, y: 0, w: 6, h: 2 },
      { i: "shipping", x: 0, y: 2, w: 6, h: 3 },
      { i: "financial", x: 0, y: 5, w: 6, h: 2 },
      { i: "orderItems", x: 0, y: 7, w: 6, h: 3 },
      { i: "serviceNotes", x: 0, y: 10, w: 6, h: 3 },
      { i: "comments", x: 0, y: 13, w: 6, h: 3 },
    ],
  })

  return (
    <div className="p-0">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 12, sm: 6 }}
        rowHeight={80}
        margin={[8, 8]}
        containerPadding={[0, 0]}
        isDraggable
        isResizable
        compactType="vertical"
        verticalCompact={true}
        preventCollision={false}
        useCSSTransforms
      >
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
          <OrderItemsCard drugDetails={drugDetails} />
        </div>
        
        <div key="serviceNotes" className="bg-white rounded-lg shadow-sm overflow-auto">
          <ServiceNotes orderId={order?.orderid || 0} />
        </div>
        
        <div key="comments" className="bg-white rounded-lg shadow-sm overflow-auto">
          <CommentsCard comments={comments} />
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}