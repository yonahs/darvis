import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProductTableSkeleton } from "./table/ProductTableSkeleton"
import { ProductStatusBadges } from "./table/ProductStatusBadges"

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
  shipper_name: string | null
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

  const getShipperColor = (shipper: string | null) => {
    if (!shipper) return "bg-gray-100 text-gray-600"
    
    const shipperColors: { [key: string]: string } = {
      "Pharma Shaul": "bg-[#E5DEFF] text-[#5B21B6]",
      "Leading Up": "bg-[#FEF3C7] text-[#92400E]",
      "SUBS 2": "bg-[#DBEAFE] text-[#1E40AF]",
      "Aktive": "bg-[#FCE7F3] text-[#9D174D]",
      "FedEx": "bg-[#ECFCCB] text-[#3F6212]",
      "UPS": "bg-[#FEF9C3] text-[#854D0E]",
      "DHL": "bg-[#FFEDD5] text-[#9A3412]",
      "USPS": "bg-[#F3E8FF] text-[#6B21A8]",
      "EMS": "bg-[#DBEAFE] text-[#1E40AF]",
      "TNT": "bg-[#FEE2E2] text-[#991B1B]",
      "Aramex": "bg-[#FFE4E6] text-[#9F1239]",
    }

    return shipperColors[shipper] || "bg-[#F1F0FB] text-gray-700"
  }

  if (isLoading || isFetching) {
    return <ProductTableSkeleton pageSize={pageSize} />
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
        {products?.map((product) => (
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
              <ProductStatusBadges
                available={product.available}
                prescription={product.prescription}
                otc={product.otc}
              />
            </TableCell>
            <TableCell>
              <span>{product.supplier_full_name || product.supplier_name}</span>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded text-sm font-medium ${getShipperColor(product.shipper_name)}`}>
                {product.shipper_name || '-'}
              </span>
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