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
    
    // Map shippers to specific colors with higher contrast
    const shipperColors: { [key: string]: string } = {
      "Pharma Shaul": "bg-[#E5DEFF] text-[#5B21B6]", // Deep purple theme
      "Leading Up": "bg-[#FEF3C7] text-[#92400E]",   // Warm amber theme
      "SUBS 2": "bg-[#DBEAFE] text-[#1E40AF]",      // Royal blue theme
      "Aktive": "bg-[#FCE7F3] text-[#9D174D]",      // Pink theme
      "FedEx": "bg-[#ECFCCB] text-[#3F6212]",       // Lime green theme
      "UPS": "bg-[#FEF9C3] text-[#854D0E]",         // Yellow theme
      "DHL": "bg-[#FFEDD5] text-[#9A3412]",         // Orange theme
      "USPS": "bg-[#F3E8FF] text-[#6B21A8]",        // Purple theme
      "EMS": "bg-[#DBEAFE] text-[#1E40AF]",         // Blue theme
      "TNT": "bg-[#FEE2E2] text-[#991B1B]",         // Red theme
      "Aramex": "bg-[#FFE4E6] text-[#9F1239]",      // Rose theme
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
        {orders?.map((order) => (
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