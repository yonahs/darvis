
import { useParams, useNavigate } from "react-router-dom"
import { OrdersTableView } from "@/components/logistics/OrdersTableView"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const ShipperOrders = () => {
  const { shipperId } = useParams()
  const navigate = useNavigate()

  const { data: shipper } = useQuery({
    queryKey: ["shipper", shipperId],
    enabled: !!shipperId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shippers")
        .select("name")
        .eq("shipperid", shipperId)
        .single()

      if (error) throw error
      return data
    },
  })

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/logistics")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          {shipper?.name || "Shipper"} Orders
        </h1>
      </div>

      <OrdersTableView
        shipperId={Number(shipperId)}
        shipperName={shipper?.name}
      />
    </div>
  )
}

export default ShipperOrders
