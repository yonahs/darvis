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
import { Button } from "@/components/ui/button"
import { AlertCircle, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigate } from "react-router-dom"

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
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const navigate = useNavigate()
  const pageSize = 10

  const { data: orders, isLoading, error, isFetching } = useQuery<OrderDetails[]>({
    queryKey: ["orders", page, search, statusFilter],
    queryFn: async () => {
      console.log("Fetching orders with params:", { page, search, statusFilter })
      try {
        let query = supabase
          .from("vw_order_details")
          .select("orderid, orderdate, clientname, orderstatus, totalsale, payment, shipper, cancelled, orderbilled")
          .order("orderdate", { ascending: false })

        // Apply search filter if present
        if (search) {
          query = query.or(`clientname.ilike.%${search}%,orderid.eq.${!isNaN(parseInt(search)) ? search : 0}`)
        }

        // Apply status filter if not "all"
        if (statusFilter && statusFilter !== "all") {
          query = query.eq("orderstatus", statusFilter)
        }

        // Apply pagination
        query = query.range((page - 1) * pageSize, page * pageSize - 1)

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
    retry: 1,
    staleTime: 30000,
  })

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleViewDetails = (orderId: number) => {
    navigate(`/orders/${orderId}`)
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
          <div className="text-muted-foreground">
            View and manage customer orders
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order # or client name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
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
                <TableHead>Actions</TableHead>
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
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order.orderid)}
                      >
                        View Details
                      </Button>
                    </TableCell>
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