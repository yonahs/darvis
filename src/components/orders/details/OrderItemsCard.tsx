import { Plus, Upload, Eye, Pill, RefreshCw, Package2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/integrations/supabase/types"

type DrugDetails = Database["public"]["Tables"]["newdrugdetails"]["Row"] & {
  prescriptionDetails?: Database["public"]["Tables"]["clientrxdetails"]["Row"] | null
}

type Order = Database["public"]["Tables"]["orders"]["Row"]

interface OrderItemsProps {
  drugDetails: DrugDetails | null
  order: Order | null
  allOrderItems?: Order[] | null
}

export const OrderItemsCard = ({ drugDetails, order, allOrderItems }: OrderItemsProps) => {
  console.log("Drug Details received:", drugDetails)
  console.log("All order items:", allOrderItems)

  const handleUploadRx = () => {
    console.log("Upload Rx clicked")
  }

  const handleViewRx = () => {
    console.log("View Rx clicked")
  }

  const handleUpdateRefills = () => {
    console.log("Update refills clicked for drug:", drugDetails?.nameil)
  }

  const getStockStatusBadge = (available: boolean | null) => {
    if (available === null) return <Badge className="rounded" variant="outline">Unknown</Badge>
    return available ? (
      <Badge className="rounded" variant="success">In Stock</Badge>
    ) : (
      <Badge className="rounded" variant="destructive">Out of Stock</Badge>
    )
  }

  const getShipperBadge = (shipperId: number | null) => {
    if (!shipperId) return null
    return (
      <Badge className="rounded" variant="secondary">
        <Package2 className="h-3 w-3 mr-1" />
        Shipper #{shipperId}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs font-medium text-primary/80 flex items-center gap-1">
            <Pill className="h-3 w-3" />
            Order Items ({allOrderItems?.length || 1} items)
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
            <Button variant="outline" size="xs" onClick={handleUpdateRefills} className="h-6 px-2 text-xs gap-1">
              <RefreshCw className="h-3 w-3" />
              Update Refills
            </Button>
            <Button variant="outline" size="xs" className="h-6 px-2 text-xs gap-1">
              <Plus className="h-3 w-3" />
              Add Item
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Drug</TableHead>
              <TableHead className="text-xs">Prescription</TableHead>
              <TableHead className="text-xs">Refills</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Price</TableHead>
              <TableHead className="text-xs">Shipper</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOrderItems?.map((item, index) => (
              <TableRow key={`${item.orderid}-${index}`}>
                <TableCell className="py-2">
                  <div className="space-y-0.5">
                    <div className="text-xs font-medium">{drugDetails?.nameil}</div>
                    <div className="text-xs text-muted-foreground">
                      {drugDetails?.strength} - {item.amount} units
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <Badge className="rounded text-xs" variant={drugDetails?.otc ? "secondary" : "default"}>
                    {drugDetails?.otc ? "OTC" : "Rx"}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  {drugDetails?.prescriptionDetails ? (
                    <span className="text-xs">
                      {drugDetails.prescriptionDetails.filled || 0}/{drugDetails.prescriptionDetails.refills || 0}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="py-2">
                  {getStockStatusBadge(drugDetails?.available)}
                </TableCell>
                <TableCell className="py-2 text-xs">{formatCurrency(item.totalsale || 0)}</TableCell>
                <TableCell className="py-2">
                  {getShipperBadge(item.shipperid)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}