import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Printer, Download, Edit, Trash, CheckCircle, XCircle, 
  CreditCard, Truck, MessageSquare, Plus 
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"

const OrderDetail = () => {
  const { orderId } = useParams()

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      console.log("Fetching order details for ID:", orderId)
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            clients (
              firstname, lastname, birthdate, personalid, email, 
              address, address2, city, state, country, zip
            ),
            newdrugdetails (
              nameil, packsize, strength, saledollar
            ),
            ordercomments (
              comment, author, commentdate
            )
          `)
          .eq("orderid", parseInt(orderId || "0"))
          .maybeSingle()

        if (error) throw error
        if (!data) throw new Error("Order not found")

        console.log("Order details fetched:", data)
        return data
      } catch (err) {
        console.error("Failed to fetch order:", err)
        throw err
      }
    },
  })

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-24 animate-pulse bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Order not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleMarkAsPaid = () => {
    toast.success("Order marked as paid")
  }

  const handleMarkAsShipped = () => {
    toast.success("Order marked as shipped")
  }

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success("Comment added successfully")
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Order #{order.orderid}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {order.orderdate && format(new Date(order.orderdate), "PPP")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {order.cancelled ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Client Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                {order.clients?.firstname} {order.clients?.lastname}
              </p>
              <p>DOB: {order.clients?.birthdate && format(new Date(order.clients.birthdate), "PP")}</p>
              <p>ID: {order.clients?.personalid}</p>
              <p>Email: {order.clients?.email}</p>
            </CardContent>
          </Card>

          {/* Order Items Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order Items</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{order.newdrugdetails?.nameil}</TableCell>
                    <TableCell>
                      {order.newdrugdetails?.strength} - {order.newdrugdetails?.packsize}
                    </TableCell>
                    <TableCell>{formatCurrency(order.newdrugdetails?.saledollar)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Financials Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Financial Details</CardTitle>
                <Button onClick={handleMarkAsPaid} variant="outline" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.usprice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{formatCurrency(order.shippingprice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold">{formatCurrency(order.totalsale)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Shipping Details</CardTitle>
                <Button onClick={handleMarkAsShipped} variant="outline" size="sm">
                  <Truck className="h-4 w-4 mr-2" />
                  Mark as Shipped
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Tracking: {order.ups || "Not available"}</p>
              <p>Status: {order.shipstatus || "Not shipped"}</p>
              <p>
                {order.address}
                {order.address2 && <br />}
                {order.address2}
                <br />
                {order.city}, {order.state} {order.zip}
                <br />
                {order.country}
              </p>
            </CardContent>
          </Card>

          {/* Comments Card */}
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.ordercomments?.map((comment: any) => (
                <div key={comment.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-muted-foreground">
                      {comment.commentdate && format(new Date(comment.commentdate), "PP")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{comment.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail