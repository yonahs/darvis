import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { OrderDetailsHeader } from "@/components/orders/details/OrderDetailsHeader"
import { OrderDetailsContent } from "@/components/orders/details/OrderDetailsContent"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]
type DrugDetails = Database["public"]["Tables"]["newdrugdetails"]["Row"]
type Comment = Database["public"]["Tables"]["ordercomments"]["Row"]

interface CombinedOrder extends Order {
  shippers: number[];
  trackingNumbers: string[];
  allOrderItems?: Order[];
}

interface OrderItemWithDetails extends Order {
  drugDetails?: DrugDetails & {
    prescriptionDetails?: Database["public"]["Tables"]["clientrxdetails"]["Row"] | null;
  };
}

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
        const combinedOrder = orders.reduce<CombinedOrder>((acc, curr) => {
          if (Object.keys(acc).length === 0) {
            return {
              ...curr,
              shippers: curr.shipperid ? [curr.shipperid] : [],
              trackingNumbers: curr.ups ? [curr.ups] : [],
              allOrderItems: orders
            }
          }
          
          return {
            ...acc,
            shippers: [...acc.shippers, ...(curr.shipperid ? [curr.shipperid] : [])],
            trackingNumbers: [...acc.trackingNumbers, ...(curr.ups ? [curr.ups] : [])],
            allOrderItems: orders
          }
        }, {} as CombinedOrder)

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

  // Fetch drug details for all items
  const { data: allItemsWithDetails } = useQuery<OrderItemWithDetails[]>({
    queryKey: ["drugDetails", orderData?.allOrderItems],
    enabled: !!orderData?.allOrderItems,
    queryFn: async () => {
      try {
        const itemsWithDetails = await Promise.all(
          (orderData?.allOrderItems || []).map(async (item) => {
            // Fetch drug details
            const { data: drug, error: drugError } = await supabase
              .from("newdrugdetails")
              .select("*")
              .eq("id", item.drugdetailid)
              .maybeSingle()

            if (drugError) throw drugError

            // Fetch prescription details if we have a client
            let prescriptionDetails = null
            if (item.clientid && drug) {
              const { data: rxDetails, error: rxError } = await supabase
                .from("clientrxdetails")
                .select("*")
                .eq("drugdetailid", item.drugdetailid)
                .order("rxdate", { ascending: false })
                .maybeSingle()

              if (rxError) {
                console.error("Error fetching prescription details:", rxError)
              } else {
                prescriptionDetails = rxDetails
              }
            }

            return {
              ...item,
              drugDetails: drug ? {
                ...drug,
                prescriptionDetails
              } : undefined
            }
          })
        )

        console.log("Items with details:", itemsWithDetails)
        return itemsWithDetails
      } catch (err) {
        console.error("Failed to fetch drug details:", err)
        return []
      }
    }
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
        drugDetails={allItemsWithDetails?.[0]?.drugDetails}
        comments={comments}
        onMarkAsShipped={handleMarkAsShipped}
        onMarkAsPaid={handleMarkAsPaid}
        allOrderItems={allItemsWithDetails}
      />
    </div>
  )
}

export default OrderDetail