import { Plus, Upload, Eye, BellDot, Pill } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/integrations/supabase/types"

type DrugDetails = Database["public"]["Tables"]["newdrugdetails"]["Row"] & {
  prescriptionDetails?: Database["public"]["Tables"]["clientrxdetails"]["Row"] | null
}

interface OrderItemsProps {
  drugDetails: DrugDetails | null
}

export const OrderItemsCard = ({ drugDetails }: OrderItemsProps) => {
  console.log("Drug Details received:", drugDetails) // Debug log

  // Helper function to determine stock status badge
  const getStockStatusBadge = (available: boolean | null) => {
    if (available === null) return <Badge className="rounded" variant="outline">Unknown</Badge>
    return available ? (
      <Badge className="rounded" variant="success">In Stock</Badge>
    ) : (
      <Badge className="rounded" variant="destructive">Out of Stock</Badge>
    )
  }

  const handleUploadRx = () => {
    console.log("Upload Rx clicked")
  }

  const handleViewRx = () => {
    console.log("View Rx clicked")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-primary/80 flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Order Items
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="xs" onClick={handleUploadRx}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Rx
            </Button>
            <Button variant="outline" size="xs" onClick={handleViewRx}>
              <Eye className="h-4 w-4 mr-2" />
              View Rx
            </Button>
            <Button variant="outline" size="xs">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drug</TableHead>
              <TableHead>Prescription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugDetails && (
              <TableRow>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <div>{drugDetails.nameil}</div>
                    <div className="text-sm text-muted-foreground">
                      {drugDetails.strength} - {drugDetails.packsize}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Badge className="rounded" variant={drugDetails.otc ? "secondary" : "default"}>
                      {drugDetails.otc ? "OTC" : "Rx"}
                    </Badge>
                    
                    {drugDetails.prescriptionDetails && (
                      <Badge className="rounded flex items-center gap-1 w-fit" variant="secondary">
                        <BellDot className="h-3 w-3" />
                        {drugDetails.prescriptionDetails.filled || 0}/{drugDetails.prescriptionDetails.refills || 0} Refills
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getStockStatusBadge(drugDetails.available)}
                </TableCell>
                <TableCell>{formatCurrency(drugDetails.saledollar)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}