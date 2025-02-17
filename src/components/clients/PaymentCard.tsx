
import { useQuery } from "@tanstack/react-query"
import { CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"

interface PaymentCardProps {
  clientId: number
}

interface Processor {
  autoid: number
  name: string
  displayname: string
  marker: string
  abbrev: string
}

interface ProcessorPayment {
  processorid: number
  processor: Processor
}

export function PaymentCard({ clientId }: PaymentCardProps) {
  const { data: orderPayments, error: orderError } = useQuery<ProcessorPayment[]>({
    queryKey: ["client-order-payments", clientId],
    queryFn: async () => {
      console.log("Fetching payment processors from orders for client:", clientId)
      const { data, error } = await supabase
        .from("orders")
        .select(`
          processorid,
          processor:processor!inner (
            autoid,
            name,
            displayname,
            marker,
            abbrev
          )
        `)
        .eq("clientid", clientId)
        .not("processorid", "is", null)
        .order("orderdate", { ascending: false })
        
      if (error) {
        console.error("Error fetching order payments:", error)
        throw error
      }
      
      // Ensure we get the correct type by mapping the response
      const uniqueProcessors = (data || []).reduce<ProcessorPayment[]>((acc, curr) => {
        // Verify processor is a single object with the correct shape
        const processorData = curr.processor as Record<string, any>
        if (!processorData || Array.isArray(processorData)) {
          console.warn('Invalid processor data:', curr)
          return acc
        }

        const payment: ProcessorPayment = {
          processorid: curr.processorid,
          processor: {
            autoid: processorData.autoid,
            name: processorData.name,
            displayname: processorData.displayname,
            marker: processorData.marker,
            abbrev: processorData.abbrev
          }
        }
        
        if (!acc.find(p => p.processor.autoid === payment.processor.autoid)) {
          acc.push(payment)
        }
        return acc
      }, [])
      
      console.log("Retrieved unique processors:", uniqueProcessors)
      return uniqueProcessors
    },
  })

  // Second query to get stored payment methods
  const { data: paymentMethods, error: methodsError } = useQuery({
    queryKey: ["client-payment-methods", clientId],
    queryFn: async () => {
      console.log("Fetching stored payment methods for client:", clientId)
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

      if (error) {
        console.error("Error fetching payment methods:", error)
        throw error
      }
      
      console.log("Retrieved payment methods:", data)
      return data
    },
  })

  if (orderError || methodsError) {
    console.error("Query error:", orderError || methodsError)
  }

  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Payment Methods Used</p>
          {orderPayments?.length ? (
            <div className="space-y-2">
              {orderPayments.map((payment) => (
                <div 
                  key={payment.processor.autoid} 
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {payment.processor.displayname || payment.processor.name}
                        {payment.processor.marker && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({payment.processor.marker})
                          </span>
                        )}
                      </p>
                      {payment.processor.abbrev && (
                        <p className="text-xs text-muted-foreground">
                          Code: {payment.processor.abbrev}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment methods found in orders</p>
          )}

          {paymentMethods?.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground mt-4 mb-2">Stored Payment Methods</p>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
