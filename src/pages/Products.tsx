import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProductCatalogTable } from "@/components/pharmacy/ProductCatalogTable"

const Products = () => {
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
          if (!product.defaultshipper) return { ...product, shipper: null }
          
          const { data: shipperData } = await supabase
            .from("shippers")
            .select("display_name")
            .eq("shipperid", product.defaultshipper)
            .single()
          
          return {
            ...product,
            shipper: shipperData || null
          }
        })
      )
      
      console.log("Product catalog data:", productsWithShippers)
      return productsWithShippers
    },
  })

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductCatalogTable
        products={products}
        isLoading={isLoading}
        isFetching={isFetching}
        pageSize={pageSize}
      />
    </div>
  )
}

export default Products