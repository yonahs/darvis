import { useState } from "react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

const Orders = () => {
  const [page] = useState(1)
  const pageSize = 10

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", page],
    queryFn: async () => {
      console.log("Fetching orders page:", page)
      const { data, error } = await supabase
        .from("vw_order_details")
        .select()
        .order("orderdate", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (error) {
        console.error("Error fetching orders:", error)
        throw error
      }

      console.log("Fetched orders:", data)
      return data
    },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Orders</h2>
          <p className="text-muted-foreground">
            View and manage customer orders
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Shipping</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                orders?.map((order) => (
                  <TableRow key={order.orderid}>
                    <TableCell className="font-medium">
                      #{order.orderid}
                    </TableCell>
                    <TableCell>
                      {new Date(order.orderdate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.clientname}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.cancelled
                            ? "destructive"
                            : order.orderbilled
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.orderstatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(order.totalsale)}</TableCell>
                    <TableCell>{order.payment}</TableCell>
                    <TableCell>{order.shipper}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Orders