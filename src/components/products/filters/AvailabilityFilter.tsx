import React from "react"
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

const availabilityOptions = [
  "Available",
  "Out of Stock",
  "Prescription Only",
  "OTC"
]

interface AvailabilityFilterProps {
  availabilityFilter: string[]
  onAvailabilityFilterChange: (value: string[]) => void
}

export const AvailabilityFilter = ({
  availabilityFilter,
  onAvailabilityFilterChange,
}: AvailabilityFilterProps) => {
  const [open, setOpen] = React.useState(false)

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
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
  )
}