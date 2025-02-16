
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { useState } from "react"

const AiListBuilder = () => {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setIsLoading(true)
    // TODO: Implement query processing
    setIsLoading(false)
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
              <Search className="mr-2 h-4 w-4" />
              Search
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
                {/* TODO: Add results rows */}
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Enter a query to see results
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AiListBuilder
