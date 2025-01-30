import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

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
        
        if (shipperError) {
          console.error("Error fetching shippers:", shipperError)
          toast.error("Failed to fetch shippers data")
          throw shipperError
        }

        // Get orders from the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("shipperid, shipstatus, status, ups")
          .not('shipperid', 'is', null)
          .not('cancelled', 'eq', true)
          .gte('orderdate', thirtyDaysAgo.toISOString())
          .not('status', 'in', '(99, 100)')
          .not('shipstatus', 'eq', 99)

        if (ordersError) {
          console.error("Error fetching orders:", ordersError)
          toast.error("Failed to fetch orders data")
          throw ordersError
        }

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
        }).filter(shipper => shipper.totalOrders > 0) || []

        console.log("Calculated shipper stats:", shippersWithStats)
        return shippersWithStats
      } catch (err) {
        console.error("Error fetching logistics data:", err)
        toast.error("Failed to load logistics data")
        throw err
      }
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000 // Refresh every 30 seconds
  })
}