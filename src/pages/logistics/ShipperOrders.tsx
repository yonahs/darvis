
import { useParams, useNavigate } from "react-router-dom"
import { OrdersTableView } from "@/components/logistics/OrdersTableView"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const ShipperOrders = () => {
  const { shipperId } = useParams()
  const navigate = useNavigate()

  const { data: shipper } = useQuery({
    queryKey: ["shipper", shipperId],
    enabled: !!shipperId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shippers")
        .select("display_name")
        .eq("shipperid", parseInt(shipperId as string))
        .single()

      if (error) throw error
      return data
    },
  })

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/logistics")}>
                Logistics
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{shipper?.display_name || "Shipper"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/logistics")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {shipper?.display_name || "Shipper"} Orders
          </h1>
        </div>
      </div>

      <OrdersTableView
        shipperId={Number(shipperId)}
        shipperName={shipper?.display_name}
      />
    </div>
  )
}

export default ShipperOrders
