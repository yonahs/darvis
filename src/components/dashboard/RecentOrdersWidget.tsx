
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const RecentOrdersWidget = () => {
  const [page, setPage] = useState(1)
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
  ]

  return (
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
              disabled={page * 10 >= 100}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
