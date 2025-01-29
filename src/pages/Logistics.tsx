import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ShipperStats {
  name: string
  totalOrders: number
  uploaded: number
  notUploaded: number
  shipperid: number
}

// Simplified OrderDetails type with only the fields we need
type OrderDetails = {
  orderid: number
  clientname: string | null
  orderdate: string | null
  totalsale: number | null
  orderstatus: string | null // Changed to string to match the view's return type
}

const Logistics = () => {
  const { toast } = useToast()
  const [selectedShipper, setSelectedShipper] = useState<ShipperStats | null>(null)
  const [showUploaded, setShowUploaded] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: shippers, isLoading, refetch } = useQuery({
    queryKey: ["logistics-stats"],
    queryFn: async () => {
      console.log("Fetching logistics statistics...")
      try {
        // Fetch shippers
        const { data: shipperData, error: shipperError } = await supabase
          .from("shippers")
          .select("*")
          .order('display_name')
        
        if (shipperError) throw shipperError

        // Fetch active orders awaiting shipping
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("shipperid, shipstatus, status, ups")
          .not('shipperid', 'is', null)
          .not('cancelled', 'eq', true)
          .is('ups', null)  // Only orders without tracking numbers
          .gte('orderdate', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .not('status', 'in', '(99, 100)') // Exclude completed/closed orders
          .not('shipstatus', 'eq', 99) // Exclude delivered orders

        if (ordersError) throw ordersError

        console.log("Fetched orders:", orders?.length)

        // Calculate stats for each shipper
        const shippersWithStats: ShipperStats[] = shipperData?.map(shipper => {
          const shipperOrders = orders?.filter(order => order.shipperid === shipper.shipperid) || []
          const uploaded = shipperOrders.filter(order => order.shipstatus === 2).length
          const total = shipperOrders.length

          return {
            shipperid: shipper.shipperid,
            name: shipper.display_name || shipper.company_name || "Unnamed Shipper",
            totalOrders: total,
            uploaded: uploaded,
            notUploaded: total - uploaded
          }
        }) || []

        console.log("Calculated shipper stats:", shippersWithStats)
        return shippersWithStats
      } catch (err) {
        console.error("Error fetching logistics data:", err)
        throw err
      }
    },
    staleTime: 0,
    refetchInterval: 5000
  })

  const { data: selectedOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["shipper-orders", selectedShipper?.shipperid, showUploaded],
    queryFn: async () => {
      if (!selectedShipper) return []
      
      console.log("Fetching orders for shipper:", selectedShipper.shipperid, "showUploaded:", showUploaded)
      
      const query = supabase
        .from("vw_order_details")
        .select("orderid, clientname, orderdate, totalsale, orderstatus")
        .eq("shipper", selectedShipper.name)
        .not('cancelled', 'eq', true)
        .gte('orderdate', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .not('orderstatus', 'in', '(99, 100)')

      if (showUploaded) {
        query.eq('shipstatus', 2)
      } else {
        query.or('shipstatus.is.null,shipstatus.neq.2')
      }

      const { data, error } = await query
      
      if (error) {
        console.error("Error fetching shipper orders:", error)
        throw error
      }
      
      console.log("Fetched orders for shipper:", data?.length)
      return data as OrderDetails[]
    },
    enabled: !!selectedShipper,
  })

  // Set up real-time subscription
  useEffect(() => {
    console.log("Setting up real-time subscription for orders table")
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        async (payload) => {
          console.log('Orders table changed:', payload)
          toast({
            title: "Order Update",
            description: "Order data has changed. Refreshing statistics...",
          })
          await refetch()
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status)
      })

    return () => {
      console.log("Cleaning up real-time subscription")
      supabase.removeChannel(channel)
    }
  }, [refetch, toast])

  const handleViewOrders = (shipper: ShipperStats, uploaded: boolean) => {
    setSelectedShipper(shipper)
    setShowUploaded(uploaded)
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Logistics Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          shippers?.map((shipper) => (
            <Card key={shipper.shipperid} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg font-bold">{shipper.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {shipper.totalOrders} orders pending
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-muted-foreground">Uploaded</span>
                      <span className="ml-2 text-green-600">{shipper.uploaded}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Not Uploaded</span>
                      <span className="ml-2 text-orange-600">{shipper.notUploaded}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1.5 mt-3">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-blue-50 hover:bg-blue-100 text-xs"
                      onClick={() => handleViewOrders(shipper, true)}
                    >
                      View Uploaded
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-blue-50 hover:bg-blue-100 text-xs"
                      onClick={() => handleViewOrders(shipper, false)}
                    >
                      View Pending
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedShipper?.name} - {showUploaded ? 'Uploaded' : 'Pending'} Orders
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Total Sale</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingOrders ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading orders...</TableCell>
                  </TableRow>
                ) : selectedOrders && selectedOrders.length > 0 ? (
                  selectedOrders.map((order) => (
                    <TableRow key={order.orderid}>
                      <TableCell>{order.orderid}</TableCell>
                      <TableCell>{order.clientname}</TableCell>
                      <TableCell>{new Date(order.orderdate!).toLocaleDateString()}</TableCell>
                      <TableCell>${order.totalsale?.toFixed(2)}</TableCell>
                      <TableCell>{order.orderstatus}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No orders found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Logistics