import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { Database } from "@/integrations/supabase/types"

type DrugDetails = Database["public"]["Tables"]["newdrugdetails"]["Row"]

interface OrderItemsProps {
  drugDetails: DrugDetails | null
}

export const OrderItemsCard = ({ drugDetails }: OrderItemsProps) => {
  // Helper function to determine stock status badge
  const getStockStatusBadge = (available: boolean | null) => {
    if (available === null) return <Badge variant="outline">Unknown</Badge>
    return available ? (
      <Badge variant="success">In Stock</Badge>
    ) : (
      <Badge variant="destructive">Out of Stock</Badge>
    )
  }

  // Helper function to determine prescription badge
  const getPrescriptionBadge = (otc: boolean | null) => {
    if (otc === null) return <Badge variant="outline">Status Unknown</Badge>
    return !otc ? (
      <Badge variant="default">Prescription Required</Badge>
    ) : (
      <Badge variant="secondary">Over The Counter</Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-primary/80">Order Items</CardTitle>
          <Button variant="outline" size="xs">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drug</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugDetails && (
              <TableRow>
                <TableCell className="font-medium">{drugDetails.nameil}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{drugDetails.strength} - {drugDetails.packsize}</div>
                    <div className="flex gap-2">
                      {getPrescriptionBadge(drugDetails.otc)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {getStockStatusBadge(drugDetails.available)}
                  </div>
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