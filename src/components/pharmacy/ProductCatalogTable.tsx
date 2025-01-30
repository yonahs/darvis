import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface ProductCatalog {
  drugid: number
  nameus: string | null
  chemical: string | null
  prescription: boolean | null
  ivf: boolean | null
  drug_detail_id: number
  nameil: string | null
  strength: string | null
  packsize: number | null
  form: number | null
  brand: boolean | null
  available: boolean | null
  otc: boolean | null
  saledollar: number | null
  salenis: number | null
  supplier: number | null
  defaultshipper: number | null
  supplier_name: string | null
  turkeycostprice: number | null
  turkey_cost_usd: number | null
  canada_cost_usd: number | null
  supplier_full_name: string | null
  shipper: {
    display_name: string | null
  } | null
}

interface ProductCatalogTableProps {
  products: ProductCatalog[] | undefined
  isLoading: boolean
  isFetching: boolean
  pageSize: number
}

export const ProductCatalogTable = ({
  products,
  isLoading,
  isFetching,
  pageSize,
}: ProductCatalogTableProps) => {
  const { toast } = useToast()

  const getAvailabilityBadge = (available: boolean | null) => {
    if (available === null) return <Badge variant="outline">Unknown</Badge>
    return available ? (
      <Badge variant="success">In Stock</Badge>
    ) : (
      <Badge variant="destructive">Out of Stock</Badge>
    )
  }

  const getPrescriptionBadge = (prescription: boolean | null, otc: boolean | null) => {
    if (otc) return <Badge variant="secondary">OTC</Badge>
    if (prescription) return <Badge>Rx Required</Badge>
    return <Badge variant="outline">Unknown</Badge>
  }

  if (isLoading || isFetching) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Shipper</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead>Price (NIS)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: pageSize }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (!products?.length) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Shipper</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead>Price (NIS)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              No products found
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Shipper</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Price (USD)</TableHead>
          <TableHead>Price (NIS)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow 
            key={`${product.drugid}-${product.drug_detail_id}`}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell>
              <div className="space-y-1">
                <div className="font-medium">
                  {product.nameus}
                </div>
                <div className="text-sm text-muted-foreground">
                  {product.chemical}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="text-sm">{product.strength}</div>
                <div className="text-sm text-muted-foreground">
                  Pack size: {product.packsize || '-'}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                {getAvailabilityBadge(product.available)}
                {getPrescriptionBadge(product.prescription, product.otc)}
              </div>
            </TableCell>
            <TableCell>
              <span>{product.supplier_full_name || product.supplier_name}</span>
            </TableCell>
            <TableCell>
              <span>-</span>
            </TableCell>
            <TableCell>
              <span>Israel</span>
            </TableCell>
            <TableCell>{product.saledollar ? formatCurrency(product.saledollar) : '-'}</TableCell>
            <TableCell>{product.salenis ? `₪${product.salenis.toFixed(2)}` : '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}