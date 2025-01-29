import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Pill, Stethoscope } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const Pharmacy = () => {
  const { data: prescriptionData, isLoading } = useQuery({
    queryKey: ["pharmacy-prescriptions"],
    queryFn: async () => {
      console.log("Fetching prescription data...")
      const { data, error } = await supabase
        .from("clientrx")
        .select(`
          *,
          clientrxdetails(*)
        `)
        .order("dateuploaded", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching prescriptions:", error)
        throw error
      }

      console.log("Fetched prescriptions:", data)
      return data
    },
  })

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Pharmacy Dashboard</h2>
            <p className="text-muted-foreground">
              Manage prescriptions and pharmacy workflows
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Prescriptions
              </CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold">
                  {prescriptionData?.length || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Verifications
              </CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <div className="text-2xl font-bold">
                  {prescriptionData?.filter(rx => !rx.info).length || 0}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
            <CardDescription>
              Latest prescription uploads and verifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
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
                {prescriptionData?.map((rx) => (
                  <div
                    key={rx.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">
                        Prescription #{rx.id} - Client #{rx.clientid}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded: {new Date(rx.dateuploaded).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        Status:{" "}
                        <span
                          className={
                            rx.info ? "text-green-600" : "text-yellow-600"
                          }
                        >
                          {rx.info ? "Verified" : "Pending"}
                        </span>
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

export default Pharmacy