import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { data: orderDetails, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      console.log('Fetching order details for:', orderId);
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          clients (*),
          newdrugdetails (*),
          newdrugs (*),
          ordercomments (*)
        `)
        .eq('orderid', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        throw error;
      }

      console.log('Fetched order details:', order);
      return order;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!orderDetails) {
    return <div>Order not found</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Order #{orderId}</h1>
          <Badge>{orderDetails.orderstatus}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Cancel Order</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Order Date</div>
              <div>{format(new Date(orderDetails.orderdate), 'PPP')}</div>
              
              <div className="text-sm text-muted-foreground">Status</div>
              <div>{orderDetails.orderstatus}</div>
              
              <div className="text-sm text-muted-foreground">Payment Method</div>
              <div>{orderDetails.payment || 'Not specified'}</div>
              
              <div className="text-sm text-muted-foreground">Total Sale</div>
              <div>${orderDetails.totalsale}</div>
            </div>
          </div>
        </Card>

        {/* Client & Shipping Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Client & Shipping</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-muted-foreground">Client Name</div>
              <div>{orderDetails.clients?.firstname} {orderDetails.clients?.lastname}</div>
              
              <div className="text-sm text-muted-foreground">Address</div>
              <div>
                {orderDetails.address}<br />
                {orderDetails.address2 && <>{orderDetails.address2}<br /></>}
                {orderDetails.city}, {orderDetails.state} {orderDetails.zip}<br />
                {orderDetails.country}
              </div>
              
              <div className="text-sm text-muted-foreground">Phone</div>
              <div>{orderDetails.clients?.dayphone || 'Not provided'}</div>
            </div>
          </div>
        </Card>

        {/* Order Items Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium">
              <div>Item</div>
              <div>Strength</div>
              <div>Quantity</div>
              <div>Price</div>
            </div>
            <Separator />
            <div className="space-y-2">
              {orderDetails.newdrugdetails && (
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>{orderDetails.newdrugs?.nameus}</div>
                  <div>{orderDetails.newdrugdetails.strength}</div>
                  <div>{orderDetails.amount}</div>
                  <div>${orderDetails.usprice}</div>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full">Add Item</Button>
          </div>
        </Card>

        {/* Comments Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Comments & Activity</h2>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            {orderDetails.ordercomments?.map((comment: any) => (
              <div key={comment.id} className="mb-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-muted-foreground">
                    {format(new Date(comment.commentdate), 'PPp')}
                  </span>
                </div>
                <p className="mt-1 text-sm">{comment.comment}</p>
              </div>
            ))}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetail;