
import { useQuery } from "@tanstack/react-query"
import { CalendarClock, Package, CreditCard, AlertCircle } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

interface ClientOrderTimelineProps {
  clientId: number
}

export function ClientOrderTimeline({ clientId }: ClientOrderTimelineProps) {
  const { data: orders, isLoading } = useQuery({
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
          ordercomments (
            comment,
            commentdate,
            author
          )
        `)
        .eq("clientid", clientId)
        .order("orderdate", { ascending: false })

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return <div className="space-y-4">
      {[1,2,3].map(i => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  }

  const getStatusIcon = (order: any) => {
    if (order.cancelled) return <AlertCircle className="h-4 w-4 text-red-500" />
    if (order.problemorder) return <AlertCircle className="h-4 w-4 text-yellow-500" />
    if (order.shipstatus === 2) return <Package className="h-4 w-4 text-green-500" />
    if (order.orderbilled) return <CreditCard className="h-4 w-4 text-blue-500" />
    return <CalendarClock className="h-4 w-4 text-gray-500" />
  }

  const getStatusText = (order: any) => {
    if (order.cancelled) return "Order Cancelled"
    if (order.problemorder) return "Problem Order"
    if (order.shipstatus === 2) return "Shipped"
    if (order.orderbilled) return "Paid"
    return "Order Placed"
  }

  return (
    <div className="space-y-4">
      {orders?.map((order) => (
        <div key={order.orderid} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
          <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
            {getStatusIcon(order)}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Order #{order.orderid}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.orderdate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${order.totalsale?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{getStatusText(order)}</p>
              </div>
            </div>
            {order.ordercomments?.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-md space-y-2">
                {order.ordercomments.map((comment: any, i: number) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{comment.author}:</span>{" "}
                    <span className="text-muted-foreground">{comment.comment}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
