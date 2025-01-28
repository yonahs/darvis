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
  // Optimized layout with distinct sections
  const [layouts] = useState({
    lg: [
      // Top section - 2 columns for main content
      { i: "orderItems", x: 0, y: 0, w: 2, h: 2, minW: 2, maxW: 2 },
      { i: "logistics", x: 2, y: 0, w: 1, h: 1.5, minW: 1 },
      
      // Middle section - 3 columns for details
      { i: "client", x: 0, y: 2, w: 1, h: 1.2, minW: 1 },
      { i: "shipping", x: 1, y: 2, w: 1, h: 1.2, minW: 1 },
      { i: "financial", x: 2, y: 2, w: 1, h: 1.2, minW: 1 },
      
      // Bottom section - 2 columns for extended content
      { i: "serviceNotes", x: 0, y: 3.2, w: 1, h: 1.8, minW: 1 },
      { i: "comments", x: 1, y: 3.2, w: 2, h: 1.8, minW: 2 },
    ],
    md: [
      // Tablet layout - 2 columns
      { i: "orderItems", x: 0, y: 0, w: 2, h: 2 },
      { i: "logistics", x: 0, y: 2, w: 2, h: 1.5 },
      { i: "client", x: 0, y: 3.5, w: 1, h: 1.2 },
      { i: "shipping", x: 1, y: 3.5, w: 1, h: 1.2 },
      { i: "financial", x: 0, y: 4.7, w: 2, h: 1.2 },
      { i: "serviceNotes", x: 0, y: 5.9, w: 1, h: 1.8 },
      { i: "comments", x: 1, y: 5.9, w: 1, h: 1.8 },
    ],
    sm: [
      // Mobile layout - single column
      { i: "orderItems", x: 0, y: 0, w: 1, h: 2 },
      { i: "logistics", x: 0, y: 2, w: 1, h: 1.5 },
      { i: "client", x: 0, y: 3.5, w: 1, h: 1.2 },
      { i: "shipping", x: 0, y: 4.7, w: 1, h: 1.2 },
      { i: "financial", x: 0, y: 5.9, w: 1, h: 1.2 },
      { i: "serviceNotes", x: 0, y: 7.1, w: 1, h: 1.8 },
      { i: "comments", x: 0, y: 8.9, w: 1, h: 1.8 },
    ],
  })

  return (
    <div className="p-1">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={130}
        margin={[8, 8]}
        containerPadding={[0, 0]}
        isDraggable
        isResizable
        compactType="vertical"
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