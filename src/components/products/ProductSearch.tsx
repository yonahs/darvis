import React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

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

const availabilityOptions = [
  "Available",
  "Out of Stock",
  "Prescription Only",
  "OTC"
]

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
  const [openSupplier, setOpenSupplier] = React.useState(false)
  const [openShipper, setOpenShipper] = React.useState(false)
  const [openAvailability, setOpenAvailability] = React.useState(false)

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      console.log("Fetching suppliers...")
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, name")
        .order("name")

      if (error) {
        console.error("Error fetching suppliers:", error)
        throw error
      }
      
      console.log("Fetched suppliers:", data)
      return data || []
    },
  })

  const { data: shippers = [] } = useQuery({
    queryKey: ["shippers"],
    queryFn: async () => {
      console.log("Fetching shippers...")
      const { data, error } = await supabase
        .from("shippers")
        .select("shipperid, display_name")
        .order("display_name")

      if (error) {
        console.error("Error fetching shippers:", error)
        throw error
      }
      
      console.log("Fetched shippers:", data)
      return data || []
    },
  })

  const toggleSupplier = (supplierId: string) => {
    const currentFilters = [...supplierFilter]
    const index = currentFilters.indexOf(supplierId)
    if (index > -1) {
      currentFilters.splice(index, 1)
    } else {
      currentFilters.push(supplierId)
    }
    onSupplierFilterChange(currentFilters)
  }

  const toggleShipper = (shipperId: string) => {
    const currentFilters = [...shipperFilter]
    const index = currentFilters.indexOf(shipperId)
    if (index > -1) {
      currentFilters.splice(index, 1)
    } else {
      currentFilters.push(shipperId)
    }
    onShipperFilterChange(currentFilters)
  }

  const toggleAvailability = (availability: string) => {
    const currentFilters = [...availabilityFilter]
    const index = currentFilters.indexOf(availability)
    if (index > -1) {
      currentFilters.splice(index, 1)
    } else {
      currentFilters.push(availability)
    }
    onAvailabilityFilterChange(currentFilters)
  }

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
          <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSupplier}
                className="min-w-[200px] justify-between"
              >
                {supplierFilter.length === 0
                  ? "Filter by supplier"
                  : `${supplierFilter.length} supplier${supplierFilter.length > 1 ? 's' : ''} selected`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search suppliers..." />
                <CommandEmpty>No supplier found.</CommandEmpty>
                <CommandGroup>
                  {suppliers.map((supplier) => (
                    <CommandItem
                      key={supplier.id}
                      value={supplier.name}
                      onSelect={() => toggleSupplier(supplier.id.toString())}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          supplierFilter.includes(supplier.id.toString()) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {supplier.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openShipper} onOpenChange={setOpenShipper}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openShipper}
                className="min-w-[200px] justify-between"
              >
                {shipperFilter.length === 0
                  ? "Filter by shipper"
                  : `${shipperFilter.length} shipper${shipperFilter.length > 1 ? 's' : ''} selected`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search shippers..." />
                <CommandEmpty>No shipper found.</CommandEmpty>
                <CommandGroup>
                  {shippers.map((shipper) => (
                    <CommandItem
                      key={shipper.shipperid}
                      value={shipper.display_name}
                      onSelect={() => toggleShipper(shipper.shipperid.toString())}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          shipperFilter.includes(shipper.shipperid.toString()) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {shipper.display_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openAvailability} onOpenChange={setOpenAvailability}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openAvailability}
                className="min-w-[200px] justify-between"
              >
                {availabilityFilter.length === 0
                  ? "Filter by availability"
                  : `${availabilityFilter.length} filter${availabilityFilter.length > 1 ? 's' : ''} selected`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search availability..." />
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup>
                  {availabilityOptions.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => toggleAvailability(option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          availabilityFilter.includes(option) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}