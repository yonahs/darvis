
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientOrderTimeline } from "@/components/clients/ClientOrderTimeline"
import { ClientHealthInfo } from "@/components/clients/ClientHealthInfo"

export default function ClientDetail() {
  const { clientId } = useParams()

  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("clientid", parseInt(clientId || "0"))
        .single()

      if (error) throw error
      return data
    },
  })

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!client) {
    return <div className="p-6">Client not found</div>
  }

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/clients">Clients</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {client.firstname} {client.lastname}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-6">
        {client.firstname} {client.lastname}
      </h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{client.mobile || client.dayphone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p>{client.address}</p>
              <p>{client.city}, {client.state} {client.zip}</p>
              <p>{client.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.doctor && (
              <div>
                <p className="text-sm text-muted-foreground">Doctor</p>
                <p>{client.doctor}</p>
              </div>
            )}
            {client.drphone && (
              <div>
                <p className="text-sm text-muted-foreground">Doctor's Phone</p>
                <p>{client.drphone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p>{client.active ? "Active" : "Inactive"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Health Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientHealthInfo client={client} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientOrderTimeline clientId={parseInt(clientId || "0")} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
