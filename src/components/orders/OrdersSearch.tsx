import React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface OrdersSearchProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  shipperFilter: string
  onShipperFilterChange: (value: string) => void
}

export const OrdersSearch = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  shipperFilter,
  onShipperFilterChange,
}: OrdersSearchProps) => {
  const { data: shippers } = useQuery({
    queryKey: ["shippers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shippers")
        .select("shipperid, display_name")
        .order("display_name")

      if (error) throw error
      return data
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order # or client name"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={onDateRangeChange}
          />
          <Select value={shipperFilter} onValueChange={onShipperFilterChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by shipper" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shippers</SelectItem>
              {shippers?.map((shipper) => (
                <SelectItem key={shipper.shipperid} value={shipper.shipperid.toString()}>
                  {shipper.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}