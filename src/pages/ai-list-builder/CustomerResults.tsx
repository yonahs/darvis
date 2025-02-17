
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { CustomerResult, CallOutcome } from "./types"
import { supabase } from "@/integrations/supabase/client"
import { Phone, CheckCircle, Printer, Search, MessageSquare } from "lucide-react"

interface CustomerResultsProps {
  results: CustomerResult[]
}

export function CustomerResults({ results }: CustomerResultsProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResult | null>(null)
  const [notes, setNotes] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  if (results.length === 0) return null

  const filteredResults = results.filter(customer => 
    customer.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <CardTitle>Results ({filteredResults.length} customers)</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrintList}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print List
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResults.map((customer) => (
            <Card 
              key={customer.clientid}
              className="hover:bg-accent transition-colors"
            >
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-lg">
                      {customer.firstname} {customer.lastname}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.email}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="font-medium">Contact</div>
                      <div>📱 {customer.mobile || 'N/A'}</div>
                      <div>☎️ {customer.dayphone || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="font-medium">Orders</div>
                      <div>🛍️ Total: {customer.total_orders}</div>
                      <div>💰 Value: ${customer.total_value?.toFixed(2)}</div>
                    </div>
                  </div>

                  {customer.last_order_details && (
                    <div className="text-sm">
                      <div className="font-medium">Last Order</div>
                      <div>
                        {customer.last_order_details.drug_name} |
                        Qty: {customer.last_order_details.quantity} |
                        ${customer.last_order_details.value?.toFixed(2)}
                      </div>
                      <div className="text-muted-foreground">
                        📅 {new Date(customer.last_order_details.date).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenZendesk(customer)}
                      className="flex-1"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedCustomer(customer)}
                          className="flex-1"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
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
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
