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
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the type for order details from the view
type OrderDetails = {
  orderid: number
  orderdate: string
  clientname: string
  orderstatus: string
  totalsale: number
  payment: string
  shipper: string
  cancelled: boolean
  orderbilled: number
}

const Orders = () => {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { toast } = useToast()

  const { data: orders, isLoading, error, isFetching } = useQuery<OrderDetails[]>({
    queryKey: ["orders", page],
    queryFn: async () => {
      console.log("Fetching orders page:", page)
      try {
        const { data, error } = await supabase
          .from("vw_order_details")
          .select("orderid, orderdate, clientname, orderstatus, totalsale, payment, shipper, cancelled, orderbilled")
          .order("orderdate", { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1)

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
    retry: 1,
    staleTime: 30000, // Cache data for 30 seconds
  })

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load orders. Please try refreshing the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

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
              {(isLoading || isFetching) ? (
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
              ) : orders?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
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

        <div className="flex justify-center gap-2">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button variant="outline" disabled>
            Page {page}
          </Button>
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={!orders?.length || orders.length < pageSize || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Orders