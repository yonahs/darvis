
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CustomerResult } from "./types"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { Phone, PhoneOff, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ResultsTableProps {
  results: CustomerResult[]
}

export const ResultsTable = ({ results }: ResultsTableProps) => {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResult | null>(null)
  const { toast } = useToast()
  const form = useForm({
    defaultValues: {
      outcome: '',
      notes: '',
      followUpDate: ''
    }
  })

  const handleLogCall = async (data: any) => {
    if (!selectedCustomer) return

    try {
      const { error } = await supabase
        .from('customer_call_logs')
        .insert({
          client_id: selectedCustomer.clientid,
          outcome: data.outcome,
          notes: data.notes,
          follow_up_date: data.followUpDate ? new Date(data.followUpDate).toISOString() : null
        })

      if (error) throw error

      toast({
        title: "Call logged successfully",
        description: "The call outcome has been recorded"
      })
      
      setSelectedCustomer(null)
    } catch (error) {
      console.error('Error logging call:', error)
      toast({
        title: "Error logging call",
        description: "There was a problem recording the call outcome",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Last Purchase</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Support</TableHead>
            <TableHead>Last Contact</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Enter a query to see results
              </TableCell>
            </TableRow>
          ) : (
            results.map((customer) => (
              <TableRow key={customer.clientid}>
                <TableCell>
                  {customer.firstname} {customer.lastname}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{customer.email}</div>
                    {customer.mobile && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.mobile}
                      </div>
                    )}
                    {customer.dayphone && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.dayphone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(customer.last_purchase).toLocaleDateString()}</TableCell>
                <TableCell>{customer.total_orders}</TableCell>
                <TableCell>
                  {customer.total_tickets && customer.total_tickets > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={customer.open_tickets && customer.open_tickets > 0 ? "destructive" : "secondary"}>
                          {customer.total_tickets} tickets
                        </Badge>
                        {customer.open_tickets && customer.open_tickets > 0 && (
                          <Badge variant="outline">{customer.open_tickets} open</Badge>
                        )}
                      </div>
                      {customer.last_ticket_date && (
                        <span className="text-xs text-muted-foreground">
                          Last: {new Date(customer.last_ticket_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No tickets</span>
                  )}
                </TableCell>
                <TableCell>
                  {customer.last_call ? (
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="w-fit">
                        {customer.last_call.outcome}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(customer.last_call.called_at).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Never called
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          Log Call
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Log Call with {customer.firstname} {customer.lastname}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleLogCall)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="outcome"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Call Outcome</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select outcome" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="contacted">Contacted</SelectItem>
                                      <SelectItem value="no_answer">No Answer</SelectItem>
                                      <SelectItem value="voicemail">Left Voicemail</SelectItem>
                                      <SelectItem value="wrong_number">Wrong Number</SelectItem>
                                      <SelectItem value="unreachable">Unreachable</SelectItem>
                                      <SelectItem value="do_not_call">Do Not Call</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Notes</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Enter call notes..." {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button type="submit">Save Call Log</Button>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/clients/${customer.clientid}`}>View Details</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
