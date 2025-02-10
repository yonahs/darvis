
import { useQuery } from "@tanstack/react-query"
import { CalendarClock, Package, CreditCard, AlertCircle, Box } from "lucide-react"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderComment {
  id: number
  comment: string
  commentdate: string
  author: string
  orderid: number
}

interface OrderItem {
  drugdetailid: number
  amount: number
  nameil?: string
  strength?: string
  drugDetails?: {
    nameil: string
    strength: string
  }
}

interface Order {
  orderid: number
  orderdate: string
  totalsale: number
  orderbilled: number
  shipstatus: number
  cancelled: boolean
  outofstock: boolean
  problemorder: boolean
  ordercomments: OrderComment[]
  items?: OrderItem[]
}

interface OrderData extends Omit<Order, "ordercomments" | "items"> {
  drugdetailid: number
  amount: number
}

interface ClientOrderTimelineProps {
  clientId: number
}

export function ClientOrderTimeline({ clientId }: ClientOrderTimelineProps) {
  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["client-orders", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          orderid,
          orderdate,
          totalsale,
          orderbilled,
          shipstatus,
          cancelled,
          outofstock,
          problemorder,
          drugdetailid,
          amount
        `)
        .eq("clientid", clientId)
        .order("orderdate", { ascending: false })
        .limit(50)

      if (error) throw error
      return data as OrderData[]
    },
  })

  // Fetch drug details for all orders
  const { data: drugDetails, isLoading: drugDetailsLoading } = useQuery({
    queryKey: ["order-drug-details", orders],
    enabled: !!orders?.length,
    queryFn: async () => {
      const drugDetailIds = orders?.map(order => order.drugdetailid).filter(Boolean) || []
      if (!drugDetailIds.length) return []

      const { data, error } = await supabase
        .from("newdrugdetails")
        .select("id, nameil, strength")
        .in("id", drugDetailIds)

      if (error) throw error
      return data
    },
  })

  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["order-comments", clientId],
    queryFn: async () => {
      if (!orders?.length) return []
      
      const orderIds = orders.map(order => order.orderid)
      const { data, error } = await supabase
        .from("ordercomments")
        .select("*")
        .in("orderid", orderIds)
        .order("commentdate", { ascending: false })

      if (error) throw error
      return data as OrderComment[]
    },
    enabled: !!orders?.length,
  })

  const isLoading = ordersLoading || commentsLoading || drugDetailsLoading

  if (isLoading) {
    return <div className="space-y-3">
      {[1,2,3].map(i => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  }

  // Combine orders with their comments and drug details
  const ordersWithDetails = orders?.map(order => {
    const orderDrugDetails = drugDetails?.find(d => d.id === order.drugdetailid)
    return {
      ...order,
      ordercomments: comments?.filter(comment => comment.orderid === order.orderid) || [],
      items: [{
        drugdetailid: order.drugdetailid,
        amount: order.amount,
        drugDetails: orderDrugDetails
      }]
    }
  })

  const getStatusIcon = (order: Order) => {
    if (order.cancelled) return <AlertCircle className="h-4 w-4 text-red-500" />
    if (order.problemorder) return <AlertCircle className="h-4 w-4 text-yellow-500" />
    if (order.shipstatus === 2) return <Package className="h-4 w-4 text-green-500" />
    if (order.orderbilled) return <CreditCard className="h-4 w-4 text-blue-500" />
    return <CalendarClock className="h-4 w-4 text-gray-500" />
  }

  const getStatusText = (order: Order) => {
    if (order.cancelled) return "Order Cancelled"
    if (order.problemorder) return "Problem Order"
    if (order.shipstatus === 2) return "Delivered"
    if (order.orderbilled) return "Paid"
    return "Order Placed"
  }

  return (
    <div className="space-y-2">
      {ordersWithDetails?.map((order) => (
        <Link 
          key={order.orderid} 
          to={`/orders/${order.orderid}`}
          className="block hover:bg-gray-50 transition-colors rounded-lg"
        >
          <div className="relative pl-6 pb-2 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
            <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
              {getStatusIcon(order)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Order #{order.orderid}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.orderdate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${order.totalsale?.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{getStatusText(order)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-md p-2">
                <div className="flex items-center gap-2 text-xs">
                  <Box className="h-3 w-3 text-gray-500" />
                  <div>
                    <span className="font-medium">
                      {order.items?.[0]?.drugDetails?.nameil || "Unknown Product"}
                    </span>
                    {order.items?.[0]?.drugDetails?.strength && (
                      <span className="text-muted-foreground">
                        {" - "}{order.items?.[0]?.drugDetails?.strength}
                      </span>
                    )}
                    <span className="text-muted-foreground ml-1">
                      x {order.items?.[0]?.amount || 0} units
                    </span>
                  </div>
                </div>
              </div>

              {order.ordercomments?.length > 0 && (
                <div className="bg-gray-50 p-2 rounded-md space-y-1">
                  {order.ordercomments.map((comment) => (
                    <div key={comment.id} className="text-xs">
                      <span className="font-medium">{comment.author}:</span>{" "}
                      <span className="text-muted-foreground">{comment.comment}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
