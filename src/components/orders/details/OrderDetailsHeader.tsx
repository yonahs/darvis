import { OrderSummaryCard } from "./OrderSummaryCard"
import { OrderStatusBadge } from "./OrderStatusBadge"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface OrderDetailsHeaderProps {
  order: Order | null
  onEscalate: () => void
}

export const OrderDetailsHeader = ({ order, onEscalate }: OrderDetailsHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <OrderSummaryCard order={order} />
      <OrderStatusBadge order={order} onEscalate={onEscalate} />
    </div>
  )
}