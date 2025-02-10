
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const ShipperOrdersWidget = () => {
  const { data: shipperOrders, isLoading } = useQuery({
    queryKey: ['shipperOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          shipperid,
          shippers (
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
        const shipperName = order.shippers?.display_name;
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
        </div>
      </CardContent>
    </Card>
  )
}
