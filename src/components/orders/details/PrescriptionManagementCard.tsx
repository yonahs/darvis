import { Upload, Eye, Edit, FileText, Calendar, Pill, Link } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types"

type Order = Database["public"]["Tables"]["orders"]["Row"]
type DrugDetails = Database["public"]["Tables"]["newdrugdetails"]["Row"]

interface PrescriptionDetails {
  rxid: number
  rxdate: string
  drugid: number
  strength: string
  totalboxesallowed: number | null
  filled: number | null
  qtypercycle: number | null
  duration: string | null
  refills: number | null
  clientrx: {
    dateuploaded: string | null
    image: string | null
    directory: string | null
  } | null
}

interface PrescriptionManagementCardProps {
  order: Order | null
  drugDetails: DrugDetails | null
}

export const PrescriptionManagementCard = ({ order, drugDetails }: PrescriptionManagementCardProps) => {
  const { data: prescriptionDetails } = useQuery<PrescriptionDetails>({
    queryKey: ["prescription", order?.orderid],
    enabled: !!order?.orderid && !!drugDetails?.strength,
    queryFn: async () => {
      console.log("Fetching prescription details for order:", order?.orderid)
      const { data, error } = await supabase
        .from('clientrxdetails')
        .select(`
          rxid,
          rxdate,
          drugid,
          strength,
          totalboxesallowed,
          filled,
          qtypercycle,
          duration,
          refills,
          clientrx (
            dateuploaded,
            image,
            directory
          )
        `)
        .eq('drugid', order?.drugid)
        .eq('strength', drugDetails?.strength)
        .order('rxdate', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error("Error fetching prescription details:", error)
        throw error
      }

      console.log("Prescription details:", data)
      return data as PrescriptionDetails
    }
  })

  const handleUploadRx = () => {
    console.log("Upload Rx clicked")
  }

  const handleViewRx = () => {
    if (prescriptionDetails?.clientrx?.directory && prescriptionDetails?.clientrx?.image) {
      const imageUrl = `https://old.israelpharm.com/${prescriptionDetails.clientrx.directory}/${prescriptionDetails.clientrx.image}`
      window.open(imageUrl, '_blank')
    }
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
            <Button 
              variant="outline" 
              size="xs" 
              onClick={handleViewRx} 
              className="h-6 px-2 text-xs gap-1"
              disabled={!prescriptionDetails?.clientrx?.image}
            >
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
        {prescriptionDetails ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Prescription Date</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {prescriptionDetails.rxdate
                    ? format(new Date(prescriptionDetails.rxdate), "MMM dd, yyyy")
                    : "Not specified"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Upload Date</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {prescriptionDetails.clientrx?.dateuploaded
                    ? format(new Date(prescriptionDetails.clientrx.dateuploaded), "MMM dd, yyyy")
                    : "Not specified"}
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
                    {drugDetails?.nameil}
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    {prescriptionDetails.strength || "N/A"}
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    {prescriptionDetails.refills || 0}
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    {prescriptionDetails.filled || 0}
                  </TableCell>
                  <TableCell className="py-2 text-xs">
                    {calculateRefillsLeft(
                      prescriptionDetails.refills,
                      prescriptionDetails.filled
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {prescriptionDetails.duration && (
              <div className="text-xs text-muted-foreground">
                Duration: {prescriptionDetails.duration}
              </div>
            )}

            {prescriptionDetails.clientrx?.image && (
              <div className="text-xs flex items-center gap-1">
                <Link className="h-3 w-3" />
                <a 
                  href={`https://old.israelpharm.com/${prescriptionDetails.clientrx.directory}/${prescriptionDetails.clientrx.image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Prescription Image
                </a>
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