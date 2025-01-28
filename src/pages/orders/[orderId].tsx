import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { OrderSummaryCard } from "@/components/orders/details/OrderSummaryCard"
import { ClientDetailsCard } from "@/components/orders/details/ClientDetailsCard"
import { OrderItemsCard } from "@/components/orders/details/OrderItemsCard"
import { FinancialDetailsCard } from "@/components/orders/details/FinancialDetailsCard"
import { ShippingDetailsCard } from "@/components/orders/details/ShippingDetailsCard"
import { CommentsCard } from "@/components/orders/details/CommentsCard"

const OrderDetail = () => {
  const { orderId } = useParams()

  // Fetch order details
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

  if (orderLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
          <OrderSummaryCard order={orderData} />
          <ClientDetailsCard client={clientData} />
          <OrderItemsCard drugDetails={drugDetails} />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <FinancialDetailsCard order={orderData} onMarkAsPaid={handleMarkAsPaid} />
          <ShippingDetailsCard order={orderData} onMarkAsShipped={handleMarkAsShipped} />
          <CommentsCard comments={comments} />
        </div>
      </div>
    </div>
  )
}

export default OrderDetail