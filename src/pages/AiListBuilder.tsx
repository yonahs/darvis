
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Loader2, Save, PlayCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CustomerResult {
  clientid: number
  firstname: string
  lastname: string
  email: string
  total_orders: number
  last_purchase: string
}

interface SavedSegment {
  id: string
  name: string
  description: string | null
  natural_language_query: string
  created_at: string
  last_executed_at: string | null
}

const AiListBuilder = () => {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<CustomerResult[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [segmentName, setSegmentName] = useState("")
  const [segmentDescription, setSegmentDescription] = useState("")
  const [savedSegments, setSavedSegments] = useState<SavedSegment[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadSavedSegments()
  }, [])

  const loadSavedSegments = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_segments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setSavedSegments(data)
    } catch (error) {
      console.error('Error loading segments:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved segments"
      })
    }
  }

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
      loadSavedSegments() // Refresh the list
    } catch (error) {
      console.error('Error saving segment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save segment. Please try again."
      })
    }
  }

  const executeSegment = async (segment: SavedSegment) => {
    setQuery(segment.natural_language_query)
    await handleQuerySubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <Tabs defaultValue="builder">
        <TabsList>
          <TabsTrigger value="builder">Query Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
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
          <Card className="mt-6">
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
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Query</TableHead>
                      <TableHead>Last Executed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedSegments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No saved segments yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      savedSegments.map((segment) => (
                        <TableRow key={segment.id}>
                          <TableCell>{segment.name}</TableCell>
                          <TableCell>{segment.description || '-'}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {segment.natural_language_query}
                          </TableCell>
                          <TableCell>
                            {segment.last_executed_at 
                              ? new Date(segment.last_executed_at).toLocaleDateString()
                              : 'Never'}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => executeSegment(segment)}
                            >
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Run
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
