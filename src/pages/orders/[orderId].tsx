import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Printer, Download, Edit, Trash, CheckCircle, XCircle, 
  CreditCard, Truck, MessageSquare, Plus, RefreshCcw 
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
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
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

        if (orderError) throw orderError

        // Fetch tracking numbers
        const { data: trackingData, error: trackingError } = await supabase
          .from("extratrackingnumbers")
          .select("*")
          .eq("orderid", parseInt(orderId || "0"))

        if (trackingError) throw trackingError

        console.log("Order details fetched:", { orderData, trackingData })
        return { ...orderData, tracking: trackingData }
      } catch (err) {
        console.error("Failed to fetch order:", err)
        throw err
      }
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-24 w-full animate-pulse bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
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

  return (
    <div className="space-y-6 p-6">
      {/* Order Summary Card */}
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
              {order.cancelled ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <span className={getStatusColor(order.status?.toString() || "")}>
                {order.cancelled ? "Cancelled" : "Active"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Update
          </Button>
          {!order.cancelled && (
            <Button variant="destructive" size="sm">
              <Trash className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Client & Shipping Card */}
      <Card>
        <CardHeader>
          <CardTitle>Client & Shipping Details</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Client Information</h3>
            <p>{order.clients?.firstname} {order.clients?.lastname}</p>
            <p>DOB: {order.clients?.birthdate && format(new Date(order.clients.birthdate), "PP")}</p>
            <p>ID: {order.clients?.personalid}</p>
            <p>Email: {order.clients?.email}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Shipping Address</h3>
            <p>{order.address}</p>
            {order.address2 && <p>{order.address2}</p>}
            <p>{order.city}, {order.state} {order.zip}</p>
            <p>{order.country}</p>
          </div>
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
                <TableHead>Drug Name</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Pack Size</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{order.newdrugdetails?.nameil}</TableCell>
                <TableCell>{order.newdrugdetails?.strength}</TableCell>
                <TableCell>{order.newdrugdetails?.packsize}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{formatCurrency(order.newdrugdetails?.saledollar)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="font-medium">{formatCurrency(order.usprice)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shipping Cost</p>
              <p className="font-medium">{formatCurrency(order.shippingprice)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Discount</p>
              <p className="font-medium">{formatCurrency(order.discount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Extra Charges</p>
              <p className="font-medium">{formatCurrency(order.extracharges)}</p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <p className="font-semibold">Total</p>
              <p className="font-semibold text-xl">{formatCurrency(order.totalsale)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping & Tracking Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Shipping & Tracking</CardTitle>
            <Button onClick={handleMarkAsShipped} variant="outline" size="sm">
              <Truck className="h-4 w-4 mr-2" />
              Mark as Shipped
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Main Tracking Number</p>
              <p className="font-medium">{order.ups || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shipping Status</p>
              <p className="font-medium">{order.shipstatus || "Not shipped"}</p>
            </div>
          </div>
          {order.tracking && order.tracking.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Additional Tracking Numbers</h4>
              {order.tracking.map((track: any) => (
                <div key={track.autoid} className="text-sm">
                  {track.ups} ({track.contents})
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Card */}
      <Card>
        <CardHeader>
          <CardTitle>Comments & Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {order.ordercomments?.map((comment: any) => (
              <div key={comment.id} className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">{comment.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {comment.commentdate && format(new Date(comment.commentdate), "PPp")}
                  </p>
                </div>
                <p className="text-sm">{comment.comment}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="space-y-4">
            <Textarea placeholder="Add a comment..." />
            <Button type="submit">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderDetail