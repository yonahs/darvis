import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ProductCatalogTable } from "@/components/pharmacy/ProductCatalogTable"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

const Products = () => {
  const pageSize = 10
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view products.",
          variant: "destructive",
        })
      }
    }
    
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [toast])

  const { data: products, isLoading, isFetching, error } = useQuery({
    queryKey: ["product-catalog"],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Authentication required")
      }

      console.log("Fetching product catalog...")
      const { data: productData, error: productError } = await supabase
        .from("vw_product_catalog")
        .select()
      
      if (productError) {
        console.error("Error fetching product catalog:", productError)
        throw productError
      }

      // Process products without fetching shipper data first
      const productsWithoutShippers = productData.map(product => ({
        ...product,
        shipper: null
      }))

      console.log("Initial product data loaded:", productsWithoutShippers.length, "products")
      return productsWithoutShippers
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    enabled: isAuthenticated,
    meta: {
      errorMessage: "Failed to load products"
    }
  })

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Products</h1>
        <div className="bg-destructive/15 p-4 rounded-md">
          <p className="text-destructive">Please log in to view products.</p>
        </div>
      </div>
    )
  }

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