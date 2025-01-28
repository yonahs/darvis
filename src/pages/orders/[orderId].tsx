import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download, Edit, Trash, CheckCircle, XCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

const OrderDetail = () => {
  const { orderId } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      console.log("Fetching order details for ID:", orderId)
      const { data, error } = await supabase
        .from("vw_order_details")
        .select("*")
        .eq("orderid", parseInt(orderId || "0"))
        .maybeSingle()

      if (error) {
        console.error("Error fetching order:", error)
        throw error
      }

      console.log("Order details fetched:", data)
      return data
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="h-8 w-full animate-pulse bg-gray-200 rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Order not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-500"
      case "cancelled":
        return "text-red-500"
      case "pending":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    return status?.toLowerCase() === "cancelled" ? (
      <XCircle className="h-5 w-5 text-red-500" />
    ) : (
      <CheckCircle className="h-5 w-5 text-green-500" />
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Order #{order.orderid}</CardTitle>
              <CardDescription>
                {order.orderdate && format(new Date(order.orderdate), "PPP")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(order.orderstatus)}
              <span className={getStatusColor(order.orderstatus)}>
                {order.orderstatus}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Customer Details</h3>
              <p>{order.clientname}</p>
              <p>{order.country}</p>
              <p>{order.state}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Order Summary</h3>
              <p>Total Amount: {formatCurrency(order.totalsale)}</p>
              <p>Payment Status: {order.payment || "Not Available"}</p>
              <p>Shipping Method: {order.shipper || "Not Specified"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OrderDetail