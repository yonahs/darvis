
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface ShipperCount {
  name: string
  count: number
}

export const ShipperOrdersWidget = () => {
  const { data: shipperOrders, isLoading } = useQuery({
    queryKey: ['shipperOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          shipperid,
          shipper:shippers(
            display_name
          )
        `)
        .eq('cancelled', false)
        .eq('shipstatus', 1);

      if (error) {
        console.error('Error fetching shipper orders:', error);
        throw error;
      }

      // Count orders per shipper
      const shipperCounts = data.reduce((acc: Record<string, number>, order: any) => {
        // Safely access the shipper name
        const shipperName = order.shipper?.display_name;
        if (shipperName) {
          acc[shipperName] = (acc[shipperName] || 0) + 1;
        }
        return acc;
      }, {});

      // Convert to array and sort by count
      return Object.entries(shipperCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    }
  });

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Pending Orders by Shipper
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            shipperOrders?.map((shipper) => (
              <div key={shipper.name} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{shipper.name}</span>
                <span className="text-sm font-bold">{shipper.count}</span>
              </div>
            ))
          )}
          {!isLoading && (!shipperOrders || shipperOrders.length === 0) && (
            <div className="text-sm text-muted-foreground">No pending orders</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
