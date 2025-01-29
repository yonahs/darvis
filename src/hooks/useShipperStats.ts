import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ShipperStats {
  shipperid: number
  name: string
  totalOrders: number
  uploaded: number
  notUploaded: number
}

interface ShipperOrder {
  shipperid: number
  shipstatus: number | null
  status: number | null
  ups: string | null
}

export const useShipperStats = () => {
  return useQuery({
    queryKey: ["logistics-stats"],
    queryFn: async () => {
      console.log("Fetching logistics statistics...")
      try {
        const { data: shipperData, error: shipperError } = await supabase
          .from("shippers")
          .select("shipperid, display_name, company_name")
          .order('display_name')
        
        if (shipperError) throw shipperError

        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("shipperid, shipstatus, status, ups")
          .not('shipperid', 'is', null)
          .not('cancelled', 'eq', true)
          .is('ups', null)
          .gte('orderdate', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .not('status', 'in', '(99, 100)')
          .not('shipstatus', 'eq', 99)

        if (ordersError) throw ordersError

        console.log("Fetched orders:", orders?.length)

        const shippersWithStats: ShipperStats[] = shipperData?.map(shipper => {
          const shipperOrders = orders?.filter(order => order.shipperid === shipper.shipperid) || []
          const uploaded = shipperOrders.filter(order => order.shipstatus === 2).length
          const total = shipperOrders.length

          return {
            shipperid: shipper.shipperid,
            name: shipper.display_name || shipper.company_name || "Unnamed Shipper",
            totalOrders: total,
            uploaded: uploaded,
            notUploaded: total - uploaded
          }
        }) || []

        console.log("Calculated shipper stats:", shippersWithStats)
        return shippersWithStats
      } catch (err) {
        console.error("Error fetching logistics data:", err)
        throw err
      }
    },
    staleTime: 0,
    refetchInterval: 5000
  })
}