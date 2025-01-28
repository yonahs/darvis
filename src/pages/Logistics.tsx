import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

const Logistics = () => {
  const { toast } = useToast()
  const [page] = useState(1)
  const pageSize = 10

  const { data: packages, isLoading, error } = useQuery({
    queryKey: ["bsd-packages", page],
    queryFn: async () => {
      console.log("Fetching BSD packages page:", page)
      try {
        const { data, error } = await supabase
          .from("bsd_packages")
          .select("*")
          .order("shipdate", { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1)

        if (error) {
          console.error("Supabase error:", error)
          throw error
        }

        console.log("Successfully fetched packages:", data)
        return data
      } catch (err) {
        console.error("Failed to fetch packages:", err)
        toast({
          title: "Error",
          description: "Failed to fetch logistics data. Please try again later.",
          variant: "destructive",
        })
        throw err
      }
    },
  })

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <div className="rounded-md bg-destructive/15 p-4">
            <h2 className="text-lg font-semibold text-destructive">Error Loading Logistics Data</h2>
            <p className="text-sm text-destructive">Please try again later or contact support if the problem persists.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : packages?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                `${packages?.reduce((acc, pkg) => acc + (pkg.weight || 0), 0).toFixed(2)} kg`
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                `$${packages?.reduce((acc, pkg) => acc + (pkg.totalsalevalue || 0), 0).toFixed(2)}`
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Ship Date</TableHead>
                <TableHead>Packages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  </TableRow>
                ))
              ) : packages?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No shipments found
                  </TableCell>
                </TableRow>
              ) : (
                packages?.map((pkg) => (
                  <TableRow key={pkg.autoid}>
                    <TableCell>{pkg.bsd_refnumber}</TableCell>
                    <TableCell>{pkg.weight ? `${pkg.weight.toFixed(2)} kg` : "-"}</TableCell>
                    <TableCell>${pkg.totalsalevalue?.toFixed(2) || "0.00"}</TableCell>
                    <TableCell>
                      {pkg.shipdate ? formatDistanceToNow(new Date(pkg.shipdate), { addSuffix: true }) : "-"}
                    </TableCell>
                    <TableCell>{pkg.packages || 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

export default Logistics