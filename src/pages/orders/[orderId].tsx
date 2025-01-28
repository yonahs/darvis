import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OrderItemsCard } from "@/components/orders/details/OrderItemsCard"
import { ShippingDetailsCard } from "@/components/orders/details/ShippingDetailsCard"
import { CommentsCard } from "@/components/orders/details/CommentsCard"
import { OrderStatusBadge } from "@/components/orders/details/OrderStatusBadge"
import { ServiceNotes } from "@/components/orders/details/ServiceNotes"
import { LogisticsTimeline } from "@/components/orders/details/LogisticsTimeline"
import { format } from "date-fns"
import { CheckCircle, XCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

const OrderDetail = () => {
  const { orderId } = useParams()

  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      console.log("Fetching order details for ID:", orderId)
      try {
        const { data: order, error } = await supabase
          .from("orders")
          .select("*")
          .eq("orderid", parseInt(orderId || "0"))
          .maybeSingle()

        if (error) throw error
        if (!order) throw new Error("Order not found")
        
        console.log("Order fetched:", order)
        return order
      } catch (err) {
        console.error("Failed to fetch order:", err)
        throw err
      }
    },
  })

  // Fetch client details
  const { data: clientData } = useQuery({
    queryKey: ["client", orderData?.clientid],
    enabled: !!orderData?.clientid,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("clientid", orderData.clientid)
          .maybeSingle()

        if (error) throw error
        return data
      } catch (err) {
        console.error("Failed to fetch client:", err)
        return null
      }
    },
  })

  // Fetch drug details
  const { data: drugDetails } = useQuery({
    queryKey: ["drug", orderData?.drugdetailid],
    enabled: !!orderData?.drugdetailid,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("newdrugdetails")
          .select("*")
          .eq("id", orderData.drugdetailid)
          .maybeSingle()

        if (error) throw error
        return data
      } catch (err) {
        console.error("Failed to fetch drug details:", err)
        return null
      }
    },
  })

  // Fetch order comments
  const { data: comments } = useQuery({
    queryKey: ["comments", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("ordercomments")
          .select("*")
          .eq("orderid", parseInt(orderId || "0"))
          .order("commentdate", { ascending: false })

        if (error) throw error
        return data || []
      } catch (err) {
        console.error("Failed to fetch comments:", err)
        return []
      }
    },
  })

  const handleMarkAsPaid = () => {
    toast.success("Order marked as paid")
  }

  const handleMarkAsShipped = () => {
    toast.success("Order marked as shipped")
  }

  const handleEscalate = () => {
    console.log("Escalating order:", orderId)
    toast.warning("Order has been escalated to customer service")
  }

  if (orderLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-24 animate-pulse bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">Order #{orderData?.orderid}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {orderData?.orderdate && format(new Date(orderData.orderdate), "PPP")}
                  </p>
                </div>
                <OrderStatusBadge order={orderData} onEscalate={handleEscalate} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Client Details Section */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Client Details</h3>
                {clientData && (
                  <div className="space-y-1 text-sm">
                    <p>{clientData.firstname} {clientData.lastname}</p>
                    <p>DOB: {clientData.birthdate && format(new Date(clientData.birthdate), "PP")}</p>
                    <p>ID: {clientData.personalid}</p>
                    <p>Email: {clientData.email}</p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Financial Details Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold">Financial Details</h3>
                  <Button onClick={handleMarkAsPaid} variant="outline" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Mark as Paid
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(orderData?.usprice || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{formatCurrency(orderData?.shippingprice || 0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(orderData?.totalsale || 0)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Logistics Timeline */}
              <LogisticsTimeline 
                status={{ id: orderData?.shipstatus || 1, shipstatus: orderData?.shipstatus?.toString() || "Pending" }}
                lastUpdate={orderData?.sentdate}
                trackingNumber={orderData?.ups}
              />
            </CardContent>
          </Card>
          
          <OrderItemsCard drugDetails={drugDetails} />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <ShippingDetailsCard order={orderData} onMarkAsShipped={handleMarkAsShipped} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Service</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceNotes orderId={parseInt(orderId || "0")} />
            </CardContent>
          </Card>
          <CommentsCard comments={comments} />
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
