
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Loader2, Save } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [segmentName, setSegmentName] = useState("")
  const [segmentDescription, setSegmentDescription] = useState("")
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

  const handleSaveSegment = async () => {
    if (!segmentName.trim() || !query.trim()) return

    try {
      const { error } = await supabase
        .from('ai_segments')
        .insert({
          name: segmentName,
          description: segmentDescription,
          natural_language_query: query,
          structured_query: { original_query: query },
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Segment saved successfully"
      })
      setShowSaveDialog(false)
      setSegmentName("")
      setSegmentDescription("")
    } catch (error) {
      console.error('Error saving segment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save segment. Please try again."
      })
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
            {results.length > 0 && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowSaveDialog(true)}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Segment
              </Button>
            )}
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

      {/* Save Segment Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Segment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Segment Name</Label>
              <Input
                id="name"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                placeholder="Enter segment name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={segmentDescription}
                onChange={(e) => setSegmentDescription(e.target.value)}
                placeholder="Enter segment description"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSegment}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AiListBuilder
