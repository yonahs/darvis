import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"

export interface OrderDetails {
  orderid: number
  orderdate: string
  clientname: string
  orderstatus: string
  totalsale: number
  payment: string
  cancelled: boolean
  orderbilled: number
  shipper: string | null
}

interface OrdersTableProps {
  orders: OrderDetails[] | undefined
  isLoading: boolean
  isFetching: boolean
  pageSize: number
  onViewDetails: (orderId: number) => void
}

export const OrdersTable = ({
  orders,
  isLoading,
  isFetching,
  pageSize,
  onViewDetails,
}: OrdersTableProps) => {
  const getStatusVariant = (order: OrderDetails) => {
    if (order.cancelled) return "destructive"
    if (order.orderbilled) return "default" // Shipped/Processed
    return "secondary" // Pending
  }

  const getRowHoverClass = (order: OrderDetails) => {
    if (order.cancelled) return "hover:bg-red-50/50"
    if (order.orderbilled) return "hover:bg-green-50/50"
    return "hover:bg-gray-50/50"
  }

  if (isLoading || isFetching) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Shipper</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: pageSize }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (!orders?.length) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Shipper</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              No orders found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Shipper</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow 
            key={order.orderid}
            onClick={() => onViewDetails(order.orderid)}
            className={`cursor-pointer transition-colors ${getRowHoverClass(order)}`}
          >
            <TableCell className="font-medium">
              #{order.orderid}
            </TableCell>
            <TableCell>
              {new Date(order.orderdate).toLocaleDateString()}
            </TableCell>
            <TableCell>{order.clientname}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order)}>
                {order.orderstatus}
              </Badge>
            </TableCell>
            <TableCell>{formatCurrency(order.totalsale)}</TableCell>
            <TableCell>{order.payment}</TableCell>
            <TableCell>{order.shipper || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}