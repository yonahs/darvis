import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";

const Index = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['dashboard-orders'],
    queryFn: async () => {
      console.log("Fetching dashboard orders with drug details...");
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          newdrugdetails:drugdetailid (
            nameil,
            strength,
            packsize
          )
        `)
        .limit(5)
        .order('orderdate', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      console.log("Fetched orders with drug details:", data);
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders?.map((order) => (
          <Card key={order.id} className="p-4">
            <h3 className="font-semibold">Order #{order.orderid}</h3>
            {order.newdrugdetails && (
              <div className="mt-2">
                <p className="text-sm font-medium">{order.newdrugdetails.nameil}</p>
                <p className="text-sm text-gray-600">
                  {order.newdrugdetails.strength} - {order.newdrugdetails.packsize} units
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">{formatCurrency(order.totalsale || 0)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;