import { useEffect } from "react"
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
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface OrderDetails {
  orderid: number
  clientname: string | null
  orderdate: string | null
  totalsale: number | null
  orderstatus: string | null
}

interface OrdersDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  shipperId: number | null
}

export const OrdersDialog = ({
  isOpen,
  onOpenChange,
  shipperId,
}: OrdersDialogProps) => {
  const { data: shipperName } = useQuery({
    queryKey: ["shipper-name", shipperId],
    enabled: !!shipperId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shippers")
        .select("display_name")
        .eq("shipperid", shipperId)
        .single()

      if (error) throw error
      return data?.display_name || "Unknown Shipper"
    },
  })

  const { data: orders, isLoading } = useQuery({
    queryKey: ["shipper-orders", shipperId],
    enabled: !!shipperId,
    queryFn: async () => {
      console.log("Fetching orders for shipper:", shipperId)
      const { data, error } = await supabase
        .from("vw_order_details")
        .select("*")
        .eq("shipperid", shipperId)
        .order("orderdate", { ascending: false })

      if (error) {
        console.error("Error fetching orders:", error)
        throw error
      }

      console.log("Fetched orders:", data)
      return data
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {shipperName} Orders
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Loading orders...</TableCell>
                </TableRow>
              ) : orders && orders.length > 0 ? (
                orders.map((order) => (
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
  )
}