
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
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, SwapHorizontal, Upload, Clock, Truck, Navigation } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface OrdersTableViewProps {
  shipperId: number | null
  shipperName?: string
}

export const OrdersTableView = ({ shipperId, shipperName }: OrdersTableViewProps) => {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("1") // Set default to pending (1)
  const navigate = useNavigate()

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
        // Only show orders from the last 30 days
        .gte("orderdate", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

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
        return <Badge variant="success" className="flex items-center gap-1"><Upload className="h-3 w-3" /> Uploaded</Badge>
      case 1:
        return <Badge variant="destructive" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
      default:
        return <Badge variant="secondary">Processing</Badge>
    }
  }

  const getShippingStatusBadge = (status: number) => {
    switch (status) {
      case 2:
        return <Badge variant="success" className="flex items-center gap-1"><Truck className="h-3 w-3" /> Shipped</Badge>
      case 1:
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Processing</Badge>
      default:
        return <Badge variant="secondary">Not Started</Badge>
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
              <TableHead>Order Status</TableHead>
              <TableHead>Shipping Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow 
                  key={order.orderid}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/orders/${order.orderid}`, { state: { from: 'logistics' } })}
                >
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
                  <TableCell>{getShippingStatusBadge(order.status)}</TableCell>
                  <TableCell>{formatCurrency(order.totalsale)}</TableCell>
                  <TableCell>
                    {order.ups ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          {order.ups}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`https://www.ups.com/track?track=yes&trackNums=${order.ups}`, '_blank')
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
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
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <SwapHorizontal className="h-4 w-4" />
                          Change Shipper
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Shipper for Order #{order.orderid}</DialogTitle>
                        </DialogHeader>
                        {/* Content for changing shipper will be implemented later */}
                        <div className="py-4">
                          Shipper change functionality coming soon...
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
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

