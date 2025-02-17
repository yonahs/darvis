
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { OrderDetails } from "@/components/orders/OrdersTable"

interface UseOrdersProps {
  page: number
  pageSize: number
  search: string
  statusFilter: string[]
  dateRange: { from: Date | undefined; to: Date | undefined }
  shipperFilter: string[]
}

export const useOrders = ({ 
  page, 
  pageSize, 
  search, 
  statusFilter,
  dateRange,
  shipperFilter,
}: UseOrdersProps) => {
  return useQuery<OrderDetails[]>({
    queryKey: ["orders", page, search, statusFilter, dateRange, shipperFilter],
    queryFn: async () => {
      console.log("Fetching orders with params:", { page, search, statusFilter, dateRange, shipperFilter })
      try {
        let query = supabase
          .from("orders")
          .select(`
            orderid,
            orderdate,
            clients!inner (
              firstname,
              lastname
            ),
            status,
            totalsale,
            processor (name),
            shippers (display_name),
            cancelled,
            billed
          `)
          .order("orderdate", { ascending: false })

        // Apply filters
        if (search) {
          const searchNum = !isNaN(parseInt(search)) ? parseInt(search) : null
          if (searchNum) {
            query = query.eq('orderid', searchNum)
          } else {
            query = query.or(
              `clients.firstname.ilike.%${search}%,clients.lastname.ilike.%${search}%`
            )
          }
        }

        if (statusFilter.length > 0) {
          query = query.in("status", statusFilter)
        }

        if (dateRange.from) {
          query = query.gte("orderdate", dateRange.from.toISOString())
        }

        if (dateRange.to) {
          query = query.lte("orderdate", dateRange.to.toISOString())
        }

        if (shipperFilter.length > 0) {
          query = query.in("shipperid", shipperFilter)
        }

        // Apply pagination
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)

        const { data, error } = await query

        if (error) {
          console.error("Supabase error:", error)
          throw error
        }

        // Transform the data to match OrderDetails type
        const transformedData: OrderDetails[] = data.map(order => ({
          orderid: order.orderid,
          orderdate: order.orderdate,
          clientname: `${order.clients.firstname} ${order.clients.lastname}`.trim(),
          orderstatus: order.status,
          totalsale: order.totalsale,
          payment: order.processor?.name || 'Unknown',
          shipper: order.shippers?.display_name || 'Unassigned',
          cancelled: order.cancelled,
          orderbilled: order.billed ? 1 : 0
        }))

        console.log("Successfully fetched orders:", transformedData)
        return transformedData
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        throw err
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
  })
}
