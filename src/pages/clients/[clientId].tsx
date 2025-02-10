
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export default function ClientDetail() {
  const { clientId } = useParams()

  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("clientid", clientId)
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
      <h1 className="text-2xl font-bold mb-6">
        {client.firstname} {client.lastname}
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Contact Information</h2>
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
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Medical Information</h2>
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
        </div>
      </div>
    </div>
  )
}
