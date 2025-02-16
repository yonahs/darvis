
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayCircle } from "lucide-react"
import { SavedSegment } from "./types"

interface SavedSegmentsProps {
  segments: SavedSegment[]
  onExecute: (segment: SavedSegment) => void
}

export const SavedSegments = ({ segments, onExecute }: SavedSegmentsProps) => {
  return (
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
              {segments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No saved segments yet
                  </TableCell>
                </TableRow>
              ) : (
                segments.map((segment) => (
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
                        onClick={() => onExecute(segment)}
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
  )
}
