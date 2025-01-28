import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"
import { Truck } from "lucide-react"
import { Database } from "@/integrations/supabase/types"

type Shipper = Database["public"]["Tables"]["shippers"]["Row"]

const Logistics = () => {
  const { data: shippers, isLoading } = useQuery({
    queryKey: ["shippers"],
    queryFn: async () => {
      console.log("Fetching shippers...")
      const { data, error } = await supabase
        .from("shippers")
        .select("*")
        .order("display_name")

      if (error) {
        console.error("Error fetching shippers:", error)
        throw error
      }

      console.log("Fetched shippers:", data)
      return data as Shipper[]
    },
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Logistics</h2>
          <p className="text-muted-foreground">
            Manage shipping partners and track shipments
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Partners
            </CardTitle>
            <CardDescription>
              Active shipping partners and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {shippers?.map((shipper) => (
                  <div
                    key={shipper.shipperid}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{shipper.display_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {shipper.company_name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{shipper.country}</span>
                        {shipper.isintl && (
                          <span className="text-blue-500">International</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Contact: {shipper.contact_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {shipper.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Logistics