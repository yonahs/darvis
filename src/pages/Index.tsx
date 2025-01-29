import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vw_order_details')
        .select('*')
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders?.map((order) => (
          <Card key={order.orderid} className="p-4">
            <h3 className="font-semibold">Order #{order.orderid}</h3>
            <p className="text-sm text-gray-600">{order.clientname}</p>
            <p className="text-sm text-gray-600">${order.totalsale}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;