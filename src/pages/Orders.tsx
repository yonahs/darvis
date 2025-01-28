import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { OrdersHeader } from "@/components/orders/OrdersHeader"
import { OrdersSearch } from "@/components/orders/OrdersSearch"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { OrdersPagination } from "@/components/orders/OrdersPagination"
import { useOrders } from "@/hooks/useOrders"

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
  const navigate = useNavigate()

  const { data: orders, isLoading, isFetching } = useOrders({
    page,
    pageSize,
    search,
    statusFilter,
    dateRange,
    shipperFilter,
  })

  const handleViewDetails = (orderId: number) => {
    navigate(`/orders/${orderId}`)
  }

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
        orders={orders}
        isLoading={isLoading}
        isFetching={isFetching}
        pageSize={pageSize}
        onViewDetails={handleViewDetails}
      />
      <OrdersPagination
        page={page}
        isLoading={isLoading}
        hasMore={!!orders?.length && orders.length >= pageSize}
        onPageChange={setPage}
      />
    </div>
  )
}

export default Orders