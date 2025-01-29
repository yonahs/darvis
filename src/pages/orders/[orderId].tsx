import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { OrderDetailsHeader } from "@/components/orders/details/OrderDetailsHeader"
import { OrderDetailsContent } from "@/components/orders/details/OrderDetailsContent"

const OrderDetail = () => {
  const { orderId } = useParams()

  // Fetch order details - now handling split orders
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      console.log("Fetching order details for ID:", orderId)
      try {
        const { data: orders, error } = await supabase
          .from("orders")
          .select("*")
          .eq("orderid", parseInt(orderId || "0"))

        if (error) throw error
        if (!orders?.length) throw new Error("Order not found")
        
        // Combine split order information
        const combinedOrder = orders.reduce((acc, curr) => {
          return {
            ...curr,
            totalsale: (acc.totalsale || 0) + (curr.totalsale || 0),
            // Keep track of multiple shippers
            shippers: [...(acc.shippers || []), curr.shipperid].filter(Boolean),
            // Combine shipping tracking numbers
            trackingNumbers: [...(acc.trackingNumbers || []), curr.ups].filter(Boolean),
          }
        }, { shippers: [], trackingNumbers: [] })

        console.log("Combined order data:", combinedOrder)
        return combinedOrder
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
        console.error("Failed to fetch client details:", err)
        return null
      }
    },
  })

  // Fetch drug details and prescription details
  const { data: drugDetails } = useQuery({
    queryKey: ["drug", orderData?.drugdetailid],
    enabled: !!orderData?.drugdetailid,
    queryFn: async () => {
      try {
        // First fetch drug details
        const { data: drug, error: drugError } = await supabase
          .from("newdrugdetails")
          .select("*")
          .eq("id", orderData.drugdetailid)
          .maybeSingle()

        if (drugError) throw drugError

        // Then fetch prescription details if we have a client
        if (orderData.clientid) {
          const { data: rxDetails, error: rxError } = await supabase
            .from("clientrxdetails")
            .select("*")
            .eq("drugdetailid", orderData.drugdetailid)
            .order("rxdate", { ascending: false })
            .maybeSingle()

          if (rxError) {
            console.error("Error fetching prescription details:", rxError)
          }

          return {
            ...drug,
            prescriptionDetails: rxDetails || null
          }
        }

        return {
          ...drug,
          prescriptionDetails: null
        }
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

  const handleMarkAsPaid = () => {
    toast.success("Order marked as paid")
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
        client={clientData}
        drugDetails={drugDetails}
        comments={comments}
        onMarkAsShipped={handleMarkAsShipped}
        onMarkAsPaid={handleMarkAsPaid}
      />
    </div>
  )
}

export default OrderDetail
