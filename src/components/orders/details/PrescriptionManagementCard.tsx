import { Upload, Eye, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]
type DrugDetails = Database["public"]["Tables"]["newdrugdetails"]["Row"] & {
  prescriptionDetails?: Database["public"]["Tables"]["clientrxdetails"]["Row"] | null
}

interface PrescriptionManagementCardProps {
  order: Order | null
  drugDetails: DrugDetails | null
}

export const PrescriptionManagementCard = ({ order, drugDetails }: PrescriptionManagementCardProps) => {
  const handleUploadRx = () => {
    console.log("Upload Rx clicked")
  }

  const handleViewRx = () => {
    console.log("View Rx clicked")
  }

  return (
    <Card>
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs font-medium text-primary/80 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Prescription Management
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="xs" onClick={handleUploadRx} className="h-6 px-2 text-xs gap-1">
              <Upload className="h-3 w-3" />
              Upload Rx
            </Button>
            <Button variant="outline" size="xs" onClick={handleViewRx} className="h-6 px-2 text-xs gap-1">
              <Eye className="h-3 w-3" />
              View Rx
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Rx Date</TableHead>
              <TableHead className="text-xs">Drug</TableHead>
              <TableHead className="text-xs"># Allowed</TableHead>
              <TableHead className="text-xs"># Left</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugDetails?.prescriptionDetails ? (
              <TableRow>
                <TableCell className="py-2 text-xs">
                  {drugDetails.prescriptionDetails.rxdate
                    ? format(new Date(drugDetails.prescriptionDetails.rxdate), "MMM dd, yyyy")
                    : "-"}
                </TableCell>
                <TableCell className="py-2">
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium">{drugDetails.nameil}</div>
                    <div className="text-xs text-muted-foreground">{drugDetails.strength}</div>
                  </div>
                </TableCell>
                <TableCell className="py-2 text-xs">
                  {drugDetails.prescriptionDetails.refills || 0}
                </TableCell>
                <TableCell className="py-2 text-xs">
                  {Math.max(0, (drugDetails.prescriptionDetails.refills || 0) - (drugDetails.prescriptionDetails.filled || 0))}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-sm text-muted-foreground">
                  No prescription information available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}