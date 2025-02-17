import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { CustomerResult, CallOutcome } from "./types"
import { supabase } from "@/integrations/supabase/client"
import { Phone, CheckCircle, Printer, ExternalLink, MessageCircle } from "lucide-react"

interface CustomerResultsProps {
  results: CustomerResult[]
}

export function CustomerResults({ results }: CustomerResultsProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResult | null>(null)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  if (results.length === 0) return null

  const handleLogCall = async (customerId: number, outcome: CallOutcome) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('customer_call_logs')
        .insert({
          client_id: customerId,
          outcome: outcome,
          notes: notes,
          duration_seconds: 0
        })

      if (error) throw error

      toast({
        title: "Success",
        description: `Call logged as ${outcome}`,
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

  const handleOpenZendesk = (customer: CustomerResult) => {
    const zendeskUrl = `https://your-domain.zendesk.com/agent/users/search/2?query=${encodeURIComponent(customer.email)}`
    window.open(zendeskUrl, '_blank')
  }

  const handlePrintList = () => {
    const printContent = results.map(customer => `
      Customer: ${customer.firstname} ${customer.lastname}
      Email: ${customer.email}
      Phone: ${customer.dayphone || 'N/A'}
      Mobile: ${customer.mobile || 'N/A'}
      Orders: ${customer.total_orders}
      Value: $${customer.total_value?.toFixed(2)}
      Last Purchase: ${new Date(customer.last_purchase).toLocaleDateString()}
      ${'-'.repeat(50)}
    `).join('\n')

    const printWindow = window.open('', '_blank')
    printWindow?.document.write(`
      <html>
        <head>
          <title>Customer List</title>
          <style>
            body { font-family: monospace; white-space: pre; padding: 20px; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `)
    printWindow?.document.close()
    printWindow?.print()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Results</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handlePrintList}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print List
        </Button>
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
                <div className="space-y-2 flex-1">
                  <div>
                    <div className="font-medium">
                      {customer.firstname} {customer.lastname}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.email}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Contact Details</div>
                      <div>Phone: {customer.dayphone || 'N/A'}</div>
                      <div>Mobile: {customer.mobile || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="font-medium">Order Summary</div>
                      <div>Total Orders: {customer.total_orders}</div>
                      <div>Total Value: ${customer.total_value?.toFixed(2)}</div>
                      <div>Last Purchase: {new Date(customer.last_purchase).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {customer.last_order_details && (
                    <div>
                      <div className="font-medium">Last Order Details</div>
                      <div className="text-sm">
                        Drug: {customer.last_order_details.drug_name} |
                        Quantity: {customer.last_order_details.quantity} |
                        Value: ${customer.last_order_details.value?.toFixed(2)} |
                        Date: {new Date(customer.last_order_details.date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenZendesk(customer)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Zendesk
                  </Button>
                  
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
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            disabled={isLoading || !notes}
                            onClick={() => selectedCustomer && handleLogCall(selectedCustomer.clientid, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Completed
                          </Button>
                          <Button
                            disabled={isLoading || !notes}
                            onClick={() => selectedCustomer && handleLogCall(selectedCustomer.clientid, 'no_answer')}
                            variant="secondary"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            No Answer
                          </Button>
                          <Button
                            disabled={isLoading || !notes}
                            onClick={() => selectedCustomer && handleLogCall(selectedCustomer.clientid, 'follow_up')}
                            variant="secondary"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Follow Up
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
