
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Loader2 } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface CustomerResult {
  clientid: number
  firstname: string
  lastname: string
  email: string
  total_orders: number
  last_purchase: string
}

const AiListBuilder = () => {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<CustomerResult[]>([])
  const { toast } = useToast()

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('process-client-query', {
        body: { query }
      })

      if (error) throw error

      setResults(data.results || [])
    } catch (error) {
      console.error('Error processing query:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your query. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Query Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>AI List Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuerySubmit} className="flex gap-2">
            <Input
              placeholder="Describe the customer segment you want to find..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Purchase</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Enter a query to see results
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((customer) => (
                    <TableRow key={customer.clientid}>
                      <TableCell>
                        {customer.firstname} {customer.lastname}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{new Date(customer.last_purchase).toLocaleDateString()}</TableCell>
                      <TableCell>{customer.total_orders}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AiListBuilder
