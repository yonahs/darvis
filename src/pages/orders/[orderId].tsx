import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const OrderDetail = () => {
  const { orderId } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("orderid", parseInt(orderId || "0"))
        .single()

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order #{orderId}</h1>
      <pre>{JSON.stringify(order, null, 2)}</pre>
    </div>
  )
}

export default OrderDetail