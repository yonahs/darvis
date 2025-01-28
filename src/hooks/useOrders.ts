import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { OrderDetails } from "@/components/orders/OrdersTable"

interface UseOrdersProps {
  page: number
  pageSize: number
  search: string
  statusFilter: string
}

export const useOrders = ({ page, pageSize, search, statusFilter }: UseOrdersProps) => {
  return useQuery<OrderDetails[]>({
    queryKey: ["orders", page, search, statusFilter],
    queryFn: async () => {
      console.log("Fetching orders with params:", { page, search, statusFilter })
      try {
        let query = supabase
          .from("vw_order_details")
          .select("orderid, orderdate, clientname, orderstatus, totalsale, payment, shipper, cancelled, orderbilled")
          .order("orderdate", { ascending: false })

        if (search) {
          query = query.or(`clientname.ilike.%${search}%,orderid.eq.${!isNaN(parseInt(search)) ? search : 0}`)
        }

        if (statusFilter && statusFilter !== "all") {
          query = query.eq("orderstatus", statusFilter)
        }

        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)

        const { data, error } = await query

        if (error) {
          console.error("Supabase error:", error)
          throw error
        }

        console.log("Successfully fetched orders:", data)
        return data
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        throw err
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 60000, // Refetch every minute to ensure materialized view data is current
  })
}