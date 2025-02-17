
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { CustomerResult } from "./types"
import { supabase } from "@/integrations/supabase/client"
import { Phone, CheckCircle } from "lucide-react"

interface CustomerResultsProps {
  results: CustomerResult[]
}

export function CustomerResults({ results }: CustomerResultsProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResult | null>(null)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  if (results.length === 0) return null

  const handleLogCall = async (customerId: number, outcome: 'contacted' | 'recovered') => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('customer_call_logs')
        .insert({
          client_id: customerId,
          outcome: outcome,
          notes: notes,
          duration_seconds: 0, // You could add a duration field if needed
        })

      if (error) throw error

      toast({
        title: "Success",
        description: `Customer marked as ${outcome}`,
      })
      setSelectedCustomer(null)
      setNotes("")
    } catch (error) {
      console.error('Error logging call:', error)
      toast({
        title: "Error",
        description: "Failed to log call",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          Found {results.length} matching customers
        </div>
        <div className="space-y-4">
          {results.map((customer) => (
            <div 
              key={customer.clientid}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    {customer.firstname} {customer.lastname}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {customer.email}
                  </div>
                  <div className="text-sm mt-1">
                    Orders: {customer.total_orders} | 
                    Value: ${customer.total_value?.toFixed(2)} |
                    Last Purchase: {new Date(customer.last_purchase).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Log Call
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Log Call for {selectedCustomer?.firstname} {selectedCustomer?.lastname}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Textarea
                          placeholder="Enter call notes..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            disabled={isLoading || !notes}
                            onClick={() => selectedCustomer && handleLogCall(selectedCustomer.clientid, 'contacted')}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Mark as Called
                          </Button>
                          <Button
                            disabled={isLoading || !notes}
                            onClick={() => selectedCustomer && handleLogCall(selectedCustomer.clientid, 'recovered')}
                            variant="secondary"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Recovered
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
