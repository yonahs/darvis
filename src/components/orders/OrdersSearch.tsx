import React from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
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

interface OrdersSearchProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string[]
  onStatusFilterChange: (value: string[]) => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
  shipperFilter: string[]
  onShipperFilterChange: (value: string[]) => void
}

const statuses = [
  "New",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
]

export const OrdersSearch = ({
  search,
  onSearchChange,
  statusFilter = [],
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  shipperFilter = [],
  onShipperFilterChange,
}: OrdersSearchProps) => {
  const [openStatus, setOpenStatus] = React.useState(false)
  const [openShipper, setOpenShipper] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

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

  const toggleStatus = (status: string) => {
    const currentFilters = statusFilter || []
    if (currentFilters.includes(status)) {
      onStatusFilterChange(currentFilters.filter(s => s !== status))
    } else {
      onStatusFilterChange([...currentFilters, status])
    }
  }

  const toggleShipper = (shipperId: string) => {
    const currentFilters = shipperFilter || []
    if (currentFilters.includes(shipperId)) {
      onShipperFilterChange(currentFilters.filter(s => s !== shipperId))
    } else {
      onShipperFilterChange([...currentFilters, shipperId])
    }
  }

  if (!mounted) {
    return null
  }

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
          
          <Popover open={openShipper} onOpenChange={setOpenShipper}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openShipper}
                className="min-w-[200px] justify-between"
              >
                {(shipperFilter || []).length === 0
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
                  {(shippers || []).map((shipper) => (
                    <CommandItem
                      key={shipper.shipperid}
                      value={shipper.display_name}
                      onSelect={() => toggleShipper(shipper.shipperid.toString())}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          (shipperFilter || []).includes(shipper.shipperid.toString()) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {shipper.display_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={openStatus} onOpenChange={setOpenStatus}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStatus}
                className="min-w-[200px] justify-between"
              >
                {(statusFilter || []).length === 0
                  ? "Filter by status"
                  : `${statusFilter.length} status${statusFilter.length > 1 ? 'es' : ''} selected`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search status..." />
                <CommandEmpty>No status found.</CommandEmpty>
                <CommandGroup>
                  {statuses.map((status) => (
                    <CommandItem
                      key={status}
                      value={status}
                      onSelect={() => toggleStatus(status)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          (statusFilter || []).includes(status) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {status}
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