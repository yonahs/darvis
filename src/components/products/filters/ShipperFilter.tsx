import React from "react"
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

interface ShipperFilterProps {
  shipperFilter: string[]
  onShipperFilterChange: (value: string[]) => void
}

export const ShipperFilter = ({
  shipperFilter,
  onShipperFilterChange,
}: ShipperFilterProps) => {
  const [open, setOpen] = React.useState(false)

  const { data: shippers = [], isLoading } = useQuery({
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] justify-between"
          disabled={isLoading}
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
  )
}