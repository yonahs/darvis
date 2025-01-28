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
  // Default layout for different breakpoints
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "orderItems", x: 0, y: 0, w: 1, h: 2 },
      { i: "logistics", x: 0, y: 2, w: 1, h: 1 },
      { i: "client", x: 0, y: 3, w: 1, h: 1 },
      { i: "shipping", x: 1, y: 0, w: 1, h: 1 },
      { i: "financial", x: 1, y: 1, w: 1, h: 1 },
      { i: "serviceNotes", x: 2, y: 0, w: 1, h: 1 },
      { i: "comments", x: 2, y: 1, w: 1, h: 2 },
    ],
  })

  const handleLayoutChange = (layout: any, layouts: any) => {
    setLayouts(layouts)
    // Here you could save the layout to user preferences in Supabase
    console.log("New layout saved:", layouts)
  }

  return (
    <div className="p-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 3, md: 2, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={150}
        onLayoutChange={handleLayoutChange}
        isDraggable
        isResizable
        margin={[16, 16]}
      >
        <div key="orderItems" className="shadow rounded-lg overflow-auto">
          <OrderItemsCard drugDetails={drugDetails} />
        </div>
        
        <div key="logistics" className="shadow rounded-lg overflow-auto">
          <LogisticsTimeline 
            status={{ id: order?.shipstatus || 1, shipstatus: order?.shipstatus ? String(order.shipstatus) : "Not shipped" }}
            lastUpdate={order?.sentdate}
            trackingNumber={order?.ups}
          />
        </div>
        
        <div key="client" className="shadow rounded-lg overflow-auto">
          <ClientDetailsCard client={client} />
        </div>
        
        <div key="shipping" className="shadow rounded-lg overflow-auto">
          <ShippingDetailsCard order={order} onMarkAsShipped={onMarkAsShipped} />
        </div>
        
        <div key="financial" className="shadow rounded-lg overflow-auto">
          <FinancialDetailsCard order={order} onMarkAsPaid={onMarkAsPaid} />
        </div>
        
        <div key="serviceNotes" className="shadow rounded-lg overflow-auto">
          <ServiceNotes orderId={order?.orderid || 0} />
        </div>
        
        <div key="comments" className="shadow rounded-lg overflow-auto">
          <CommentsCard comments={comments} />
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}