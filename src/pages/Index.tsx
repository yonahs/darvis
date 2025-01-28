import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { PackageSearch } from "lucide-react"

type Order = {
  orderid: number
  clientname: string | null
  orderstatus: string | null
  totalsale: number | null
  orderdate: string | null
  drugnames: string | null
  website: string | null
}

const Index = () => {
  const [realtimeOrders, setRealtimeOrders] = useState<Order[]>([])

  const { data: initialOrders, isLoading } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: async () => {
      console.log("Fetching recent orders...")
      const { data, error } = await supabase
        .from("vw_order_details")
        .select("*")
        .order("orderdate", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching orders:", error)
        throw error
      }

      console.log("Fetched orders:", data)
      return data as Order[]
    },
  })

  useEffect(() => {
    if (initialOrders) {
      setRealtimeOrders(initialOrders)
    }
  }, [initialOrders])

  useEffect(() => {
    const channel = supabase
      .channel("order-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          console.log("Received real-time update:", payload)
          
          // Fetch updated order details
          const { data: updatedOrder } = await supabase
            .from("vw_order_details")
            .select("*")
            .eq("orderid", payload.new.orderid)
            .single()

          if (updatedOrder) {
            setRealtimeOrders((current) => {
              const existing = current.findIndex(
                (order) => order.orderid === updatedOrder.orderid
              )
              
              if (existing !== -1) {
                const updated = [...current]
                updated[existing] = updatedOrder
                return updated
              }
              
              return [updatedOrder, ...current].slice(0, 10)
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your dashboard. Start managing your business.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageSearch className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>
              Live updates of your most recent orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {realtimeOrders.map((order) => (
                  <div
                    key={order.orderid}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">
                        Order #{order.orderid} - {order.clientname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.drugnames}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{order.website}</Badge>
                        <span className="text-muted-foreground">
                          {order.orderdate
                            ? formatDistanceToNow(new Date(order.orderdate), {
                                addSuffix: true,
                              })
                            : "Date unknown"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          order.orderstatus?.toLowerCase().includes("complete")
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.orderstatus}
                      </Badge>
                      <p className="mt-1 text-sm font-medium">
                        ${order.totalsale?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Index