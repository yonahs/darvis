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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface OrdersTableRowProps {
  order: any // Type this properly based on your data structure
  onRowClick: (orderId: number) => void
}

export const OrdersTableRow = ({ order, onRowClick }: OrdersTableRowProps) => {
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
              <ArrowRightLeft className="h-4 w-4" />
              Change Shipper
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Shipper for Order #{order.orderid}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Shipper change functionality coming soon...
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
