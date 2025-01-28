import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { OrderDetailsHeader } from "@/components/orders/details/OrderDetailsHeader"
import { OrderDetailsContent } from "@/components/orders/details/OrderDetailsContent"

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
            <div key={i} className="h-24 animate-pulse bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <OrderDetailsHeader order={orderData} onEscalate={handleEscalate} />
      <OrderDetailsContent
        order={orderData}
        drugDetails={drugDetails}
        comments={comments}
        onMarkAsShipped={handleMarkAsShipped}
      />
    </div>
  )
}

export default OrderDetail