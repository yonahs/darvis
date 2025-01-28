import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { OrdersHeader } from "@/components/orders/OrdersHeader"
import { OrdersSearch } from "@/components/orders/OrdersSearch"
import { OrdersTable } from "@/components/orders/OrdersTable"
import { OrdersPagination } from "@/components/orders/OrdersPagination"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useOrders } from "@/hooks/useOrders"

const Orders = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const navigate = useNavigate()
  const pageSize = 10

  const { data: orders, isLoading, error, isFetching } = useOrders({
    page,
    pageSize,
    search,
    statusFilter,
  })

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleViewDetails = (orderId: number) => {
    navigate(`/orders/${orderId}`)
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load orders. Please try refreshing the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <OrdersHeader />
        <OrdersSearch
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <div className="rounded-md border">
          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            isFetching={isFetching}
            pageSize={pageSize}
            onViewDetails={handleViewDetails}
          />
        </div>
        <OrdersPagination
          page={page}
          isLoading={isLoading}
          hasMore={!!orders?.length && orders.length >= pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </DashboardLayout>
  )
}

export default Orders