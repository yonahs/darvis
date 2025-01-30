import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProductCatalogTable } from "@/components/products/ProductCatalogTable"
import { ProductSearch } from "@/components/products/ProductSearch"

const Products = () => {
  const pageSize = 10
  const [search, setSearch] = useState("")
  const [supplierFilter, setSupplierFilter] = useState<number[]>([])
  const [shipperFilter, setShipperFilter] = useState<number[]>([])
  const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([])

  const { data: products, isLoading, isFetching } = useQuery({
    queryKey: ["product-catalog", search, supplierFilter, shipperFilter, availabilityFilter],
    queryFn: async () => {
      console.log("Fetching product catalog with filters:", {
        search,
        supplierFilter,
        shipperFilter,
        availabilityFilter
      })

      let query = supabase
        .from("vw_product_catalog")
        .select("*")

      if (search) {
        query = query.or(`nameus.ilike.%${search}%,chemical.ilike.%${search}%`)
      }

      if (supplierFilter.length > 0) {
        query = query.in('supplier', supplierFilter)
      }

      if (shipperFilter.length > 0) {
        query = query.in('defaultshipper', shipperFilter)
      }

      if (availabilityFilter.length > 0) {
        const filters = []
        if (availabilityFilter.includes('Available')) {
          filters.push({ available: true })
        }
        if (availabilityFilter.includes('Out of Stock')) {
          filters.push({ available: false })
        }
        if (availabilityFilter.includes('Prescription Only')) {
          filters.push({ prescription: true })
        }
        if (availabilityFilter.includes('OTC')) {
          filters.push({ otc: true })
        }
        if (filters.length > 0) {
          query = query.or(filters.map(f => Object.entries(f).map(([k, v]) => `${k}.eq.${v}`).join(',')).join(','))
        }
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error("Error fetching product catalog:", error)
        throw error
      }
      
      console.log("Product catalog data:", data)
      return data
    },
  })

  const handleSupplierFilterChange = (values: string[]) => {
    setSupplierFilter(values.map(v => parseInt(v, 10)))
  }

  const handleShipperFilterChange = (values: string[]) => {
    setShipperFilter(values.map(v => parseInt(v, 10)))
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="space-y-6">
        <ProductSearch
          search={search}
          onSearchChange={setSearch}
          supplierFilter={supplierFilter.map(String)}
          onSupplierFilterChange={handleSupplierFilterChange}
          shipperFilter={shipperFilter.map(String)}
          onShipperFilterChange={handleShipperFilterChange}
          availabilityFilter={availabilityFilter}
          onAvailabilityFilterChange={setAvailabilityFilter}
        />
        <ProductCatalogTable
          products={products}
          isLoading={isLoading}
          isFetching={isFetching}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}

export default Products