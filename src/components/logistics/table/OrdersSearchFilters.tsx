
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrdersSearchFiltersProps {
  search: string
  setSearch: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
}

export const OrdersSearchFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter
}: OrdersSearchFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:w-96">
        <Input
          placeholder="Search by order ID, client name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="0">Processing</SelectItem>
          <SelectItem value="1">Pending</SelectItem>
          <SelectItem value="2">Uploaded</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
