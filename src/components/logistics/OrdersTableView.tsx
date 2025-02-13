
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { OrdersSearchFilters } from "./table/OrdersSearchFilters"
import { OrdersTableRow } from "./table/OrdersTableRow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowUpDown, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

interface OrdersTableViewProps {
  shipperId: number | null
  shipperName?: string
}

export const OrdersTableView = ({ shipperId, shipperName }: OrdersTableViewProps) => {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("1") // Set default to pending (1)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const navigate = useNavigate()

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["shipper-orders", shipperId, search, statusFilter, sortOrder],
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
        .order("orderdate", { ascending: sortOrder === "asc" })
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

      console.log("Fetched orders:", data?.length)
      return data || []
    },
  })

  // Calculate summary statistics
  const summaryStats = {
    totalOrders: orders?.length || 0,
    totalValue: orders?.reduce((sum, order) => sum + (order.totalsale || 0), 0) || 0,
    pendingOrders: orders?.filter(order => order.shipstatus === 1).length || 0,
    rushOrders: orders?.filter(order => order.rushorder).length || 0
  }

  const handleRowClick = (orderId: number) => {
    navigate(`/orders/${orderId}`, { state: { from: 'logistics' } })
  }

  const toggleSort = () => {
    setSortOrder(current => current === "asc" ? "desc" : "asc")
  }

  const handleSelectAll = () => {
    if (orders) {
      if (selectedOrders.length === orders.length) {
        setSelectedOrders([])
      } else {
        setSelectedOrders(orders.map(order => order.orderid))
      }
    }
  }

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(current => {
      if (current.includes(orderId)) {
        return current.filter(id => id !== orderId)
      }
      return [...current, orderId]
    })
  }

  const handleBulkMarkAsShipped = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ shipstatus: 3 })
        .in('orderid', selectedOrders)

      if (error) throw error

      toast.success(`${selectedOrders.length} orders marked as shipped`)
      setSelectedOrders([])
      refetch()
    } catch (error) {
      console.error('Error updating orders:', error)
      toast.error('Failed to update orders')
    }
  }

  const handleBulkMarkAsProcessing = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ shipstatus: 2 })
        .in('orderid', selectedOrders)

      if (error) throw error

      toast.success(`${selectedOrders.length} orders marked as processing`)
      setSelectedOrders([])
      refetch()
    } catch (error) {
      console.error('Error updating orders:', error)
      toast.error('Failed to update orders')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold">{shipperName || "Orders"}</h2>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Orders Summary - Last 30 Days</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{summaryStats.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalValue)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Orders</p>
            <p className="text-2xl font-bold">{summaryStats.pendingOrders}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rush Orders</p>
            <p className="text-2xl font-bold">{summaryStats.rushOrders}</p>
          </div>
        </CardContent>
      </Card>
      
      <OrdersSearchFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {selectedOrders.length > 0 && (
        <div className="flex items-center gap-2 py-2">
          <span className="text-sm text-muted-foreground">
            {selectedOrders.length} orders selected
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkMarkAsProcessing}
            className="flex items-center gap-1"
          >
            <Package className="h-4 w-4" />
            Mark as Processing
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkMarkAsShipped}
            className="flex items-center gap-1"
          >
            <Truck className="h-4 w-4" />
            Mark as Shipped
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={orders?.length ? selectedOrders.length === orders.length : false}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-4"
                  onClick={toggleSort}
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
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
                <TableCell colSpan={11} className="text-center py-8">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <OrdersTableRow
                  key={order.orderid}
                  order={order}
                  onRowClick={handleRowClick}
                  selected={selectedOrders.includes(order.orderid)}
                  onSelectChange={() => handleSelectOrder(order.orderid)}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
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
