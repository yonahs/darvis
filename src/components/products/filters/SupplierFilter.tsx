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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Supplier {
  id: number
  name: string | null
}

interface SupplierFilterProps {
  supplierFilter: string[]
  onSupplierFilterChange: (value: string[]) => void
}

export const SupplierFilter = ({
  supplierFilter,
  onSupplierFilterChange,
}: SupplierFilterProps) => {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      console.log("Fetching suppliers...")
      try {
        const { data, error } = await supabase
          .from("suppliers")
          .select("id, name")
          .order("name")

        if (error) {
          console.error("Error fetching suppliers:", error)
          toast.error("Failed to load suppliers")
          return []
        }
        
        console.log("Fetched suppliers:", data)
        return (data || []) as Supplier[]
      } catch (err) {
        console.error("Error in supplier query:", err)
        toast.error("Failed to load suppliers")
        return []
      }
    },
  })

  const filteredSuppliers = React.useMemo(() => {
    return suppliers.filter(supplier => 
      supplier.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
    )
  }, [suppliers, searchQuery])

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
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : supplierFilter.length === 0 ? (
            "Filter by supplier"
          ) : (
            `${supplierFilter.length} supplier${supplierFilter.length > 1 ? 's' : ''} selected`
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search suppliers..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No supplier found.</CommandEmpty>
          <CommandGroup>
            {filteredSuppliers.map((supplier) => {
              // Ensure we always have a string value for the CommandItem
              const displayName = supplier.name || `Supplier ${supplier.id}`
              return (
                <CommandItem
                  key={supplier.id}
                  value={displayName}
                  onSelect={() => toggleSupplier(supplier.id.toString())}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      supplierFilter.includes(supplier.id.toString()) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {displayName}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}