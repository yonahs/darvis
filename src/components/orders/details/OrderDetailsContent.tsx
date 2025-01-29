import { useState, useEffect } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { OrderItemsCard } from "./OrderItemsCard"
import { ShippingAndLogisticsCard } from "./ShippingAndLogisticsCard"
import { CommentsCard } from "./CommentsCard"
import { FinancialDetailsCard } from "./FinancialDetailsCard"
import { ClientDetailsCard } from "./ClientDetailsCard"
import { OrderTimeline } from "./OrderTimeline"
import { PrescriptionManagementCard } from "./PrescriptionManagementCard"
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
  allOrderItems?: Order[] | null
}

const defaultLayouts = {
  lg: [
    { i: "client", x: 0, y: 0, w: 4, h: 2 },
    { i: "shipping", x: 4, y: 0, w: 4, h: 2 },
    { i: "financial", x: 8, y: 0, w: 4, h: 2 },
    { i: "orderItems", x: 0, y: 2, w: 6, h: 2 },
    { i: "prescription", x: 6, y: 2, w: 6, h: 2 },
    { i: "timeline", x: 0, y: 4, w: 12, h: 3 },
  ],
  md: [
    { i: "client", x: 0, y: 0, w: 4, h: 2 },
    { i: "shipping", x: 4, y: 0, w: 4, h: 2 },
    { i: "financial", x: 8, y: 0, w: 4, h: 2 },
    { i: "orderItems", x: 0, y: 2, w: 6, h: 2 },
    { i: "prescription", x: 6, y: 2, w: 6, h: 2 },
    { i: "timeline", x: 0, y: 4, w: 12, h: 3 },
  ],
  sm: [
    { i: "client", x: 0, y: 0, w: 6, h: 2 },
    { i: "shipping", x: 0, y: 2, w: 6, h: 2 },
    { i: "financial", x: 0, y: 4, w: 6, h: 2 },
    { i: "orderItems", x: 0, y: 6, w: 6, h: 2 },
    { i: "prescription", x: 0, y: 8, w: 6, h: 2 },
    { i: "timeline", x: 0, y: 10, w: 6, h: 3 },
  ],
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
    <div className="p-0">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 12, sm: 6 }}
        rowHeight={120}
        margin={[4, 4]}
        containerPadding={[0, 0]}
        isDraggable
        isResizable
        compactType="vertical"
        verticalCompact={true}
        preventCollision={false}
        useCSSTransforms
        onLayoutChange={handleLayoutChange}
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
          <OrderItemsCard drugDetails={drugDetails} order={order} allOrderItems={allOrderItems} />
        </div>

        <div key="prescription" className="bg-white rounded-lg shadow-sm overflow-auto">
          <PrescriptionManagementCard order={order} drugDetails={drugDetails} />
        </div>
        
        <div key="timeline" className="bg-white rounded-lg shadow-sm overflow-auto">
          <OrderTimeline orderId={order?.orderid || 0} comments={comments} />
        </div>
      </ResponsiveGridLayout>
    </div>
  )
}
