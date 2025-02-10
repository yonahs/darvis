
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

interface OrdersTableViewProps {
  shipperId: number | null
  shipperName?: string
}

export const OrdersTableView = ({ shipperId, shipperName }: OrdersTableViewProps) => {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("1") // Set default to pending (1)

  const { data: orders, isLoading } = useQuery({
    queryKey: ["shipper-orders", shipperId, search, statusFilter],
    enabled: !!shipperId,
    queryFn: async () => {
      console.log("Fetching orders for shipper:", shipperId)
      let query = supabase
        .from("orders")
        .select(`
          orderid,
          orderdate,
          totalsale,
          status,
          shipstatus,
          rushorder,
          outofstock,
          ups,
          shippingcost_usd,
          clients (
            firstname,
            lastname,
            email,
            country
          )
        `)
        .eq("shipperid", shipperId)
        .order("orderdate", { ascending: false })

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq("shipstatus", parseInt(statusFilter))
      }

      // Apply search filter across multiple columns
      if (search) {
        query = query.or(`
          clients.firstname.ilike.%${search}%,
          clients.lastname.ilike.%${search}%,
          clients.email.ilike.%${search}%,
          orderid.eq.${!isNaN(parseInt(search)) ? search : -1}
        `)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching orders:", error)
        throw error
      }

      console.log("Fetched orders:", data)
      return data || []
    },
  })

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 2:
        return <Badge variant="success">Uploaded</Badge>
      case 1:
        return <Badge variant="destructive">Pending</Badge>
      default:
        return <Badge variant="secondary">Processing</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">{shipperName || "Orders"}</h2>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Search by order ID, client name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="0">Processing</SelectItem>
            <SelectItem value="1">Pending</SelectItem>
            <SelectItem value="2">Uploaded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Shipping Cost</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Flags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.orderid}>
                  <TableCell className="font-medium">#{order.orderid}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(order.orderdate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{`${order.clients?.firstname} ${order.clients?.lastname}`}</span>
                      <span className="text-sm text-muted-foreground">
                        {order.clients?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{order.clients?.country}</TableCell>
                  <TableCell>{getStatusBadge(order.shipstatus)}</TableCell>
                  <TableCell>{formatCurrency(order.totalsale)}</TableCell>
                  <TableCell>{formatCurrency(order.shippingcost_usd)}</TableCell>
                  <TableCell>
                    {order.ups ? (
                      <Badge variant="outline">{order.ups}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {order.rushorder && (
                        <Badge variant="destructive">Rush</Badge>
                      )}
                      {order.outofstock && (
                        <Badge variant="destructive">Stock</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
