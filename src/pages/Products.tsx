import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProductCatalogTable } from "@/components/pharmacy/ProductCatalogTable"
import { useToast } from "@/components/ui/use-toast"

const Products = () => {
  const pageSize = 10
  const { toast } = useToast()

  const { data: products, isLoading, isFetching, error } = useQuery({
    queryKey: ["product-catalog"],
    queryFn: async () => {
      console.log("Fetching product catalog...")
      const { data: productData, error: productError } = await supabase
        .from("vw_product_catalog")
        .select()
      
      if (productError) {
        console.error("Error fetching product catalog:", productError)
        throw productError
      }

      // Fetch shipper data for each product with retries
      const productsWithShippers = await Promise.all(
        productData.map(async (product) => {
          if (!product.defaultshipper) {
            console.log(`No defaultshipper for product ${product.drugid}`)
            return { ...product, shipper: null }
          }
          
          // Implement retry logic for fetching shipper data
          const maxRetries = 3
          let retryCount = 0
          let lastError = null
          
          while (retryCount < maxRetries) {
            try {
              console.log(`Attempt ${retryCount + 1}: Fetching shipper data for defaultshipper: ${product.defaultshipper}`)
              const { data: shipperData, error: shipperError } = await supabase
                .from("shippers")
                .select("display_name")
                .eq("shipperid", product.defaultshipper)
                .maybeSingle()
              
              if (shipperError) {
                console.error(`Attempt ${retryCount + 1} failed:`, shipperError)
                lastError = shipperError
                retryCount++
                if (retryCount === maxRetries) {
                  console.log(`Max retries reached for product ${product.drugid}, returning null shipper`)
                  return { ...product, shipper: null }
                }
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
                continue
              }

              return {
                ...product,
                shipper: shipperData
              }
            } catch (err) {
              console.error(`Attempt ${retryCount + 1} failed for product ${product.drugid}:`, err)
              lastError = err
              retryCount++
              if (retryCount === maxRetries) {
                console.log(`Max retries reached for product ${product.drugid}, returning null shipper`)
                return { ...product, shipper: null }
              }
              // Wait before retrying (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
            }
          }
          
          return { ...product, shipper: null }
        })
      )
      
      console.log("Product catalog data:", productsWithShippers)
      return productsWithShippers
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    onError: (error) => {
      console.error("Failed to fetch products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      })
    },
  })

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        <div className="bg-destructive/15 p-4 rounded-md">
          <p className="text-destructive">Failed to load products. Please try again later.</p>
        </div>
      </div>
    )
  }

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