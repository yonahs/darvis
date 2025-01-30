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
}

interface Shipper {
  shipperid: number
  display_name: string | null
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

  const { data: shippers } = useQuery({
    queryKey: ["shippers"],
    queryFn: async () => {
      console.log("Fetching shippers...")
      const { data, error } = await supabase
        .from("shippers")
        .select("shipperid, display_name")

      if (error) {
        console.error("Error fetching shippers:", error)
        toast({
          title: "Error fetching shippers",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }

      console.log("Received shippers data:", data)
      return data as Shipper[]
    },
  })

  const getShipperName = (shipperId: number | null) => {
    if (!shipperId || !shippers) return "-"
    console.log("Looking for shipper with ID:", shipperId)
    console.log("Available shippers:", shippers)
    const shipper = shippers.find(s => s.shipperid === shipperId)
    console.log("Found shipper:", shipper)
    return shipper?.display_name || "-"
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
              <span>{getShipperName(product.defaultshipper)}</span>
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