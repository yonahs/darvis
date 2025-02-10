
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ExternalLink, ArrowRightLeft, Navigation } from "lucide-react"
import { OrderStatusBadge } from "./OrderStatusBadge"
import { ShippingStatusBadge } from "./ShippingStatusBadge"
import { formatCurrency } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrdersTableRowProps {
  order: any // Type this properly based on your data structure
  onRowClick: (orderId: number) => void
}

export const OrdersTableRow = ({ order, onRowClick }: OrdersTableRowProps) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>(order.shipstatus?.toString() || "1")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async () => {
    setIsUpdating(true)
    try {
      // Update the order status
      const { error: orderError } = await supabase
        .from("orders")
        .update({ shipstatus: parseInt(newStatus) })
        .eq("orderid", order.orderid)

      if (orderError) throw orderError

      // Log the status change
      const { error: logError } = await supabase
        .from("order_status_changes")
        .insert({
          order_id: order.orderid,
          old_status: order.shipstatus,
          new_status: parseInt(newStatus),
          changed_by: "User", // You might want to get this from auth context
          notes: `Status changed from ${order.shipstatus} to ${newStatus}`
        })

      if (logError) throw logError

      toast.success("Order status updated successfully")
      setIsStatusDialogOpen(false)
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onRowClick(order.orderid)}
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
      <TableCell><OrderStatusBadge status={order.shipstatus} /></TableCell>
      <TableCell><ShippingStatusBadge status={order.status} /></TableCell>
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
                window.open(
                  `https://www.ups.com/track?track=yes&trackNums=${order.ups}`,
                  "_blank"
                )
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
          {order.rushorder && <Badge variant="destructive">Rush</Badge>}
          {order.outofstock && <Badge variant="destructive">Stock</Badge>}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <ArrowRightLeft className="h-4 w-4" />
                Change Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Status for Order #{order.orderid}</DialogTitle>
                <DialogDescription>
                  Select the new status for this order
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select
                  value={newStatus}
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Pending</SelectItem>
                    <SelectItem value="2">Processing</SelectItem>
                    <SelectItem value="3">Shipped</SelectItem>
                    <SelectItem value="4">Delivered</SelectItem>
                    <SelectItem value="5">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsStatusDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusChange()
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  )
}
