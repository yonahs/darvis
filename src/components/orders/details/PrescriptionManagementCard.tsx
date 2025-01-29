import { Upload, Eye, Edit, FileText, Calendar, Pill } from "lucide-react"
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

  const handleEditRx = () => {
    console.log("Edit Rx clicked")
  }

  const calculateRefillsLeft = (allowed: number | null, filled: number | null) => {
    if (allowed === null || filled === null) return 0
    return Math.max(0, allowed - filled)
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
            <Button variant="outline" size="xs" onClick={handleEditRx} className="h-6 px-2 text-xs gap-1">
              <Edit className="h-3 w-3" />
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-4">
        {drugDetails?.prescriptionDetails ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Prescription Date</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {drugDetails.prescriptionDetails.rxdate
                    ? format(new Date(drugDetails.prescriptionDetails.rxdate), "MMM dd, yyyy")
                    : "Not specified"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Quantity Per Cycle</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Pill className="h-3 w-3" />
                  {drugDetails.prescriptionDetails.qtypercycle || "Not specified"}
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Drug</TableHead>
                  <TableHead className="text-xs">Strength</TableHead>
                  <TableHead className="text-xs"># Allowed</TableHead>
                  <TableHead className="text-xs"># Filled</TableHead>
                  <TableHead className="text-xs"># Left</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="py-2 text-xs font-medium">
                    {drugDetails.nameil}
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    {drugDetails.prescriptionDetails.strength || drugDetails.strength || "N/A"}
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    {drugDetails.prescriptionDetails.refills || 0}
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    {drugDetails.prescriptionDetails.filled || 0}
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    {calculateRefillsLeft(
                      drugDetails.prescriptionDetails.refills,
                      drugDetails.prescriptionDetails.filled
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {drugDetails.prescriptionDetails.duration && (
              <div className="text-xs text-muted-foreground">
                Duration: {drugDetails.prescriptionDetails.duration}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No prescription information available
          </div>
        )}
      </CardContent>
    </Card>
  )
}