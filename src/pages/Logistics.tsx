import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ShipperStats {
  name: string
  totalOrders: number
  uploaded: number
  notUploaded: number
}

const Logistics = () => {
  const { data: shippers, isLoading } = useQuery({
    queryKey: ["logistics-stats"],
    queryFn: async () => {
      console.log("Fetching logistics statistics...")
      try {
        const { data: shipperData, error: shipperError } = await supabase
          .from("shippers")
          .select("*")
          
        if (shipperError) throw shipperError

        // For now, we'll mock the order counts until we implement the actual counts
        const shippersWithStats: ShipperStats[] = shipperData?.map(shipper => ({
          name: shipper.display_name || "Unnamed Shipper",
          totalOrders: Math.floor(Math.random() * 50), // Mock data
          uploaded: 0,
          notUploaded: 0
        })) || []

        console.log("Fetched shippers with stats:", shippersWithStats)
        return shippersWithStats
      } catch (err) {
        console.error("Error fetching logistics data:", err)
        throw err
      }
    }
  })

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Logistics Manager</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          shippers?.map((shipper, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">{shipper.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {shipper.totalOrders} orders total
                  </p>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Total Orders</h3>
                  <p className="text-3xl font-bold">{shipper.totalOrders}</p>
                  
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Uploaded</span>
                      <span className="ml-2 text-green-600">{shipper.uploaded}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Not Uploaded</span>
                      <span className="ml-2 text-orange-600">{shipper.notUploaded}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-blue-50 hover:bg-blue-100"
                    >
                      View Uploaded
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full bg-blue-50 hover:bg-blue-100"
                    >
                      View Pending
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default Logistics