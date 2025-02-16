
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Loader2, Save } from "lucide-react"
import { CustomerResult } from "./types"
import { ResultsTable } from "./ResultsTable"

interface QueryBuilderProps {
  query: string
  setQuery: (query: string) => void
  isLoading: boolean
  results: CustomerResult[]
  onSubmit: (e: React.FormEvent) => Promise<void>
  onSaveClick: () => void
}

export const QueryBuilder = ({
  query,
  setQuery,
  isLoading,
  results,
  onSubmit,
  onSaveClick,
}: QueryBuilderProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI List Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex gap-2">
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
                onClick={onSaveClick}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Segment
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ResultsTable results={results} />
        </CardContent>
      </Card>
    </>
  )
}
