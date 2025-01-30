import React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SupplierFilter } from "./filters/SupplierFilter"
import { ShipperFilter } from "./filters/ShipperFilter"
import { AvailabilityFilter } from "./filters/AvailabilityFilter"

interface ProductSearchProps {
  search: string
  onSearchChange: (value: string) => void
  supplierFilter: string[]
  onSupplierFilterChange: (value: string[]) => void
  shipperFilter: string[]
  onShipperFilterChange: (value: string[]) => void
  availabilityFilter: string[]
  onAvailabilityFilterChange: (value: string[]) => void
}

export const ProductSearch = ({
  search,
  onSearchChange,
  supplierFilter,
  onSupplierFilterChange,
  shipperFilter,
  onShipperFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
}: ProductSearchProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or chemical"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SupplierFilter
            supplierFilter={supplierFilter}
            onSupplierFilterChange={onSupplierFilterChange}
          />
          <ShipperFilter
            shipperFilter={shipperFilter}
            onShipperFilterChange={onShipperFilterChange}
          />
          <AvailabilityFilter
            availabilityFilter={availabilityFilter}
            onAvailabilityFilterChange={onAvailabilityFilterChange}
          />
        </div>
      </div>
    </div>
  )
}