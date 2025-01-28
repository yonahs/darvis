import { useState } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { OrderItemsCard } from "./OrderItemsCard"
import { ShippingDetailsCard } from "./ShippingDetailsCard"
import { CommentsCard } from "./CommentsCard"
import { ServiceNotes } from "./ServiceNotes"
import { LogisticsTimeline } from "./LogisticsTimeline"
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
      // First row - Order Items spans 2 columns
      { i: "orderItems", x: 0, y: 0, w: 8, h: 4 },
      { i: "logistics", x: 8, y: 0, w: 4, h: 4 },
      
      // Second row - 3 equal columns
      { i: "client", x: 0, y: 4, w: 4, h: 3 },
      { i: "shipping", x: 4, y: 4, w: 4, h: 3 },
      { i: "financial", x: 8, y: 4, w: 4, h: 3 },
      
      // Third row - Service Notes and Comments
      { i: "serviceNotes", x: 0, y: 7, w: 6, h: 4 },
      { i: "comments", x: 6, y: 7, w: 6, h: 4 },
    ],
    md: [
      { i: "orderItems", x: 0, y: 0, w: 8, h: 4 },
      { i: "logistics", x: 8, y: 0, w: 4, h: 4 },
      { i: "client", x: 0, y: 4, w: 4, h: 3 },
      { i: "shipping", x: 4, y: 4, w: 4, h: 3 },
      { i: "financial", x: 8, y: 4, w: 4, h: 3 },
      { i: "serviceNotes", x: 0, y: 7, w: 6, h: 4 },
      { i: "comments", x: 6, y: 7, w: 6, h: 4 },
    ],
    sm: [
      { i: "orderItems", x: 0, y: 0, w: 6, h: 4 },
      { i: "logistics", x: 0, y: 4, w: 6, h: 4 },
      { i: "client", x: 0, y: 8, w: 6, h: 3 },
      { i: "shipping", x: 0, y: 11, w: 6, h: 3 },
      { i: "financial", x: 0, y: 14, w: 6, h: 3 },
      { i: "serviceNotes", x: 0, y: 17, w: 6, h: 4 },
      { i: "comments", x: 0, y: 21, w: 6, h: 4 },
    ],
  })

  return (
    <div className="p-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 12, sm: 6 }}
        rowHeight={100}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        isDraggable
        isResizable
        compactType={null}
        preventCollision={false}
        useCSSTransforms
      >
        <div key="orderItems" className="bg-white rounded-lg shadow-sm overflow-auto">
          <OrderItemsCard drugDetails={drugDetails} />
        </div>
        
        <div key="logistics" className="bg-white rounded-lg shadow-sm overflow-auto">
          <LogisticsTimeline 
            status={{ id: order?.shipstatus || 1, shipstatus: order?.shipstatus ? String(order.shipstatus) : "Not shipped" }}
            lastUpdate={order?.sentdate}
            trackingNumber={order?.ups}
          />
        </div>
        
        <div key="client" className="bg-white rounded-lg shadow-sm overflow-auto">
          <ClientDetailsCard client={client} />
        </div>
        
        <div key="shipping" className="bg-white rounded-lg shadow-sm overflow-auto">
          <ShippingDetailsCard order={order} onMarkAsShipped={onMarkAsShipped} />
        </div>
        
        <div key="financial" className="bg-white rounded-lg shadow-sm overflow-auto">
          <FinancialDetailsCard order={order} onMarkAsPaid={onMarkAsPaid} />
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