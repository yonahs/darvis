
import { ReactNode } from "react"

interface OrderDetailsGridProps {
  children: ReactNode
}

export const OrderDetailsGrid = ({ children }: OrderDetailsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {children}
    </div>
  )
}
