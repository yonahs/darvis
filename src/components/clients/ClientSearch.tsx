
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ClientSearchProps {
  search: string
  setSearch: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  prescriptionFilter: string
  setPrescriptionFilter: (value: string) => void
}

export function ClientSearch({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  prescriptionFilter,
  setPrescriptionFilter,
}: ClientSearchProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients by name, email or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={prescriptionFilter}
          onValueChange={setPrescriptionFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by prescription" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            <SelectItem value="with">With Prescriptions</SelectItem>
            <SelectItem value="without">Without Prescriptions</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
