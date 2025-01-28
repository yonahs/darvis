import { useState } from "react"
import { OrdersHeader } from "@/components/orders/OrdersHeader"
import { OrdersSearch } from "@/components/orders/OrdersSearch"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { OrdersPagination } from "@/components/orders/OrdersPagination"

const Orders = () => {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [shipperFilter, setShipperFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [page, setPage] = useState(1)
  const pageSize = 10

  return (
    <div className="flex-1 flex flex-col gap-8 p-8">
      <OrdersHeader />
      <OrdersSearch
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        shipperFilter={shipperFilter}
        onShipperFilterChange={setShipperFilter}
      />
      <OrdersTable
        page={page}
        pageSize={pageSize}
        search={search}
        statusFilter={statusFilter}
        dateRange={dateRange}
        shipperFilter={shipperFilter}
      />
      <OrdersPagination
        page={page}
        onPageChange={setPage}
      />
    </div>
  )
}

export default Orders