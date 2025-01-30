import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProductCatalogTable } from "@/components/pharmacy/ProductCatalogTable"

const Pharmacy = () => {
  const pageSize = 10

  const { data: products, isLoading, isFetching } = useQuery({
    queryKey: ["product-catalog"],
    queryFn: async () => {
      console.log("Fetching product catalog...")
      const { data: productData, error } = await supabase
        .from("vw_product_catalog")
        .select()
      
      if (error) {
        console.error("Error fetching product catalog:", error)
        throw error
      }

      // Fetch shipper data for each product
      const productsWithShippers = await Promise.all(
        productData.map(async (product) => {
          if (!product.defaultshipper) {
            console.log(`No defaultshipper for product ${product.drugid}`)
            return { ...product, shipper: null }
          }
          
          try {
            console.log(`Fetching shipper data for defaultshipper: ${product.defaultshipper}`)
            const { data: shipperData, error: shipperError } = await supabase
              .from("shippers")
              .select("display_name")
              .eq("shipperid", product.defaultshipper)
              .maybeSingle()
            
            if (shipperError) {
              console.error("Error fetching shipper:", shipperError)
              return { ...product, shipper: null }
            }

            return {
              ...product,
              shipper: shipperData
            }
          } catch (err) {
            console.error(`Failed to fetch shipper for product ${product.drugid}:`, err)
            return { ...product, shipper: null }
          }
        })
      )
      
      console.log("Product catalog data:", productsWithShippers)
      return productsWithShippers
    },
  })

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pharmacy Products</h1>
      </div>
      
      <ProductCatalogTable
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        pageSize={pageSize}
      />
    </div>
  )
}

export default Pharmacy