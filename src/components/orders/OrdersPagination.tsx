import React from "react"
import { Button } from "@/components/ui/button"

interface OrdersPaginationProps {
  page: number
  isLoading: boolean
  hasMore: boolean
  onPageChange: (page: number) => void
}

export const OrdersPagination = ({
  page,
  isLoading,
  hasMore,
  onPageChange,
}: OrdersPaginationProps) => {
  return (
    <div className="flex justify-center gap-2">
      <Button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isLoading}
      >
        Previous
      </Button>
      <Button variant="outline" disabled>
        Page {page}
      </Button>
      <Button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasMore || isLoading}
      >
        Next
      </Button>
    </div>
  )
}