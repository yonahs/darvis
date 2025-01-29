import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface OrderDetails {
  orderid: number
  clientname: string | null
  orderdate: string | null
  totalsale: number | null
  orderstatus: string | null
}

interface UseShipperOrdersProps {
  shipperid: number
  shipperName: string
  enabled: boolean
}

export const useShipperOrders = ({ shipperid, shipperName, enabled }: UseShipperOrdersProps) => {
  return useQuery({
    queryKey: ["shipper-orders", shipperid],
    queryFn: async () => {
      console.log("Fetching orders for shipper:", shipperid)
      
      const { data, error } = await supabase
        .from("vw_order_details")
        .select("orderid, clientname, orderdate, totalsale, orderstatus")
        .eq("shipper", shipperName)
        .not('cancelled', 'eq', true)
        .gte('orderdate', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .not('orderstatus', 'in', '(99, 100)')

      if (error) {
        console.error("Error fetching shipper orders:", error)
        throw error
      }
      
      console.log("Fetched orders for shipper:", data?.length)
      return (data || []) as OrderDetails[]
    },
    enabled,
  })
}