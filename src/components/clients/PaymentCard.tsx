
import { useQuery } from "@tanstack/react-query"
import { CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"

interface PaymentCardProps {
  clientId: number
  lifetimeValue: number
  orderCount: number
}

export function PaymentCard({ clientId, lifetimeValue, orderCount }: PaymentCardProps) {
  const { data: paymentMethods } = useQuery({
    queryKey: ["client-payment-methods", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select(`
          *,
          processor:processor_id (
            name,
            displayname
          )
        `)
        .eq("client_id", clientId)
        .order("is_default", { ascending: false })

      if (error) throw error
      return data
    },
  })

  const defaultPayment = paymentMethods?.find(pm => pm.is_default)

  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Lifetime Value</p>
            <p className="text-xl font-semibold">${lifetimeValue.toFixed(2) || "0.00"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-xl font-semibold">{orderCount || 0}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Payment Methods</p>
          {paymentMethods?.length ? (
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <div 
                  key={pm.id} 
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {pm.processor?.displayname || pm.payment_type}
                        {pm.is_default && <span className="ml-2 text-xs text-muted-foreground">(Default)</span>}
                      </p>
                      {pm.masked_number && (
                        <p className="text-xs text-muted-foreground">
                          {pm.masked_number}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment methods stored</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
