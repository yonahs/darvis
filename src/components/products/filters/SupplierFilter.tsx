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

interface SupplierFilterProps {
  supplierFilter: string[]
  onSupplierFilterChange: (value: string[]) => void
}

export const SupplierFilter = ({
  supplierFilter,
  onSupplierFilterChange,
}: SupplierFilterProps) => {
  const [open, setOpen] = React.useState(false)

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
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
  )
}