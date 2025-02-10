
import { SlackAlertsWidget } from "@/components/dashboard/SlackAlertsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Stethoscope, DollarSign, Users, PackageCheck, MessagesSquare, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slack Alerts */}
        <div className="col-span-1">
          <SlackAlertsWidget />
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
        <Card className="bg-orange-500/10">
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
              <div className="flex items-center justify-between">
                <span className="text-sm">Order #1234</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Shipped</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Order #1235</span>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Processing</span>
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
