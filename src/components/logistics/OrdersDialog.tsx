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
  orders: OrderDetails[] | undefined
  isLoading: boolean
  shipperName: string
  showUploaded: boolean
}

export const OrdersDialog = ({
  isOpen,
  onOpenChange,
  orders,
  isLoading,
  shipperName,
  showUploaded,
}: OrdersDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {shipperName} - {showUploaded ? 'Uploaded' : 'Pending'} Orders
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