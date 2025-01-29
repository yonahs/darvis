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
  itemCount?: number // Added to track number of items
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
  // Group orders by orderid and combine their data
  const groupedOrders = React.useMemo(() => {
    if (!orders) return []
    
    const grouped = orders.reduce((acc: { [key: number]: OrderDetails }, order) => {
      if (!acc[order.orderid]) {
        acc[order.orderid] = {
          ...order,
          itemCount: 1
        }
      } else {
        acc[order.orderid].itemCount = (acc[order.orderid].itemCount || 1) + 1
      }
      return acc
    }, {})

    return Object.values(grouped)
  }, [orders])

  const getStatusVariant = (order: OrderDetails) => {
    if (order.cancelled) return "destructive"
    if (order.orderbilled) return "success"
    if (order.orderstatus.toLowerCase() === "new order") return "new"
    return "secondary"
  }

  const getRowHoverClass = (order: OrderDetails) => {
    if (order.cancelled) return "hover:bg-red-50/50"
    if (order.orderbilled) return "hover:bg-green-50/50"
    return "hover:bg-gray-50/50"
  }

  const getShipperColor = (shipper: string | null) => {
    if (!shipper) return "bg-gray-100 text-gray-600"
    
    const shipperColors: { [key: string]: string } = {
      "Pharma Shaul": "bg-[#E5DEFF] text-[#5B21B6]",
      "Leading Up": "bg-[#FEF3C7] text-[#92400E]",
      "SUBS 2": "bg-[#DBEAFE] text-[#1E40AF]",
      "Aktive": "bg-[#FCE7F3] text-[#9D174D]",
      "FedEx": "bg-[#ECFCCB] text-[#3F6212]",
      "UPS": "bg-[#FEF9C3] text-[#854D0E]",
      "DHL": "bg-[#FFEDD5] text-[#9A3412]",
      "USPS": "bg-[#F3E8FF] text-[#6B21A8]",
      "EMS": "bg-[#DBEAFE] text-[#1E40AF]",
      "TNT": "bg-[#FEE2E2] text-[#991B1B]",
      "Aramex": "bg-[#FFE4E6] text-[#9F1239]",
    }

    return shipperColors[shipper] || "bg-[#F1F0FB] text-gray-700"
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
            <TableHead>Items</TableHead>
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
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (!groupedOrders?.length) {
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
            <TableHead>Items</TableHead>
            <TableHead>Shipper</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
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
          <TableHead>Items</TableHead>
          <TableHead>Shipper</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groupedOrders.map((order) => (
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
              <Badge 
                variant={getStatusVariant(order)}
                className="rounded px-2 py-0.5 text-xs font-medium"
              >
                {order.orderstatus}
              </Badge>
            </TableCell>
            <TableCell>{formatCurrency(order.totalsale)}</TableCell>
            <TableCell>{order.payment}</TableCell>
            <TableCell>
              <Badge variant="outline" className="rounded-full">
                {order.itemCount || 1} items
              </Badge>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getShipperColor(order.shipper)}`}>
                {order.shipper || '-'}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
