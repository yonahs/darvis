
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ShipperStats {
  shipperid: number
  name: string
  totalOrders: number
  uploaded: number
  notUploaded: number
  rushOrders: number
  outOfStock: number
  internationalOrders: number
  avgShippingCost: number
  isInternational: boolean
}

export const useShipperStats = () => {
  return useQuery({
    queryKey: ["logistics-stats"],
    queryFn: async () => {
      console.log("Fetching logistics statistics...")
      try {
        // First get active shippers
        const { data: shipperData, error: shipperError } = await supabase
          .from("shippers")
          .select("shipperid, display_name, company_name, isintl")
          .order('display_name')
        
        if (shipperError) {
          console.error("Error fetching shippers:", shipperError)
          toast.error("Failed to fetch shippers data")
          throw shipperError
        }

        console.log("Fetched shippers:", shipperData)

        // Get orders from the last 30 days that need shipping
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("shipperid, shipstatus, status, ups, rushorder, outofstock, shippingcost_usd, country")
          .not('shipperid', 'is', null)
          .not('cancelled', 'eq', true)
          .is('ups', null)
          .gte('orderdate', thirtyDaysAgo.toISOString())
          .not('status', 'in', '(99, 100)')
          .not('shipstatus', 'eq', 99)

        if (ordersError) {
          console.error("Error fetching orders:", ordersError)
          toast.error("Failed to fetch orders data")
          throw ordersError
        }

        console.log("Fetched orders:", orders?.length)

        // Calculate statistics for each shipper
        const shippersWithStats: ShipperStats[] = shipperData?.map(shipper => {
          const shipperOrders = orders?.filter(order => order.shipperid === shipper.shipperid) || []
          const uploaded = shipperOrders.filter(order => order.shipstatus === 2).length
          const total = shipperOrders.length
          const rushOrders = shipperOrders.filter(order => order.rushorder).length
          const outOfStock = shipperOrders.filter(order => order.outofstock).length
          const internationalOrders = shipperOrders.filter(order => order.country !== 'US').length
          const totalShippingCost = shipperOrders.reduce((sum, order) => sum + (order.shippingcost_usd || 0), 0)
          const avgShippingCost = total > 0 ? totalShippingCost / total : 0

          return {
            shipperid: shipper.shipperid,
            name: shipper.display_name || shipper.company_name || "Unnamed Shipper",
            totalOrders: total,
            uploaded: uploaded,
            notUploaded: total - uploaded,
            rushOrders,
            outOfStock,
            internationalOrders,
            avgShippingCost,
            isInternational: shipper.isintl || false
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
    staleTime: 600000, // 10 minutes
    refetchInterval: 600000 // Refresh every 10 minutes
  })
}
