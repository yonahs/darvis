
import { useState } from "react";
import { SlackAlertsWidget } from "@/components/dashboard/SlackAlertsWidget";
import { TrustpilotCard } from "@/components/dashboard/TrustpilotCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Stethoscope, DollarSign, Users, PackageCheck, MessagesSquare, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [page, setPage] = useState(1);
  const recentOrders = [
    { id: 1234, status: "Shipped" },
    { id: 1235, status: "Processing" },
    { id: 1236, status: "Pending" },
    { id: 1237, status: "Delivered" },
    { id: 1238, status: "Processing" },
    { id: 1239, status: "Shipped" },
    { id: 1240, status: "Processing" },
    { id: 1241, status: "Pending" },
    { id: 1242, status: "Shipped" },
    { id: 1243, status: "Processing" },
  ];

  const { data: shipperOrders, isLoading } = useQuery({
    queryKey: ['shipperOrders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          shipperid,
          shippers(
            display_name
          )
        `)
        .eq('cancelled', false)
        .eq('shipstatus', 1);

      if (error) throw error;

      // Count orders per shipper
      const shipperCounts = data.reduce((acc, order) => {
        const shipperName = order.shippers?.display_name;
        if (shipperName) {
          acc[shipperName] = (acc[shipperName] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Convert to array and sort by count
      return Object.entries(shipperCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    }
  });

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Slack Alerts */}
        <div className="col-span-1">
          <SlackAlertsWidget />
        </div>

        {/* Trustpilot Card */}
        <div className="col-span-1">
          <TrustpilotCard />
        </div>

        {/* Client Stats */}
        <Card className="bg-blue-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Client Overview
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Clients</span>
                <span className="text-2xl font-bold">324</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">New This Month</span>
                <span className="text-2xl font-bold">28</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="bg-orange-500/10 col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Package2 className="h-4 w-4" />
                Recent Orders
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <span className="text-sm">Order #{order.id}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Shipped' ? 'bg-green-100 text-green-700' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
              <div className="flex justify-center gap-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 10 >= 100} // Assuming 100 total orders
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions */}
        <Card className="bg-green-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Prescription Alerts
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">5 Renewals Due</span>
                <Clock className="h-4 w-4 text-orange-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">3 New Requests</span>
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipper Orders */}
        <Card className="bg-indigo-500/10">
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

        {/* Financial Overview */}
        <Card className="bg-purple-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Overview
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today's Revenue</span>
                <span className="text-2xl font-bold">$3,248</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Payments</span>
                <span className="text-2xl font-bold">$1,429</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card className="bg-red-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4" />
                Inventory Alerts
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">8 Low Stock Items</span>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Warning</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">3 Out of Stock</span>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Critical</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Activity */}
        <Card className="bg-cyan-500/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <MessagesSquare className="h-4 w-4" />
                Team Activity
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                <span className="font-medium">John</span>
                <span className="text-muted-foreground"> updated Order #1234</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Sarah</span>
                <span className="text-muted-foreground"> added shipping details</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
