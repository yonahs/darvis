import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/integrations/supabase/types"

type Client = Database["public"]["Tables"]["clients"]["Row"]

interface ClientDetailsProps {
  client: Client | null
}

export const ClientDetailsCard = ({ client }: ClientDetailsProps) => {
  if (!client) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          {client.firstname} {client.lastname}
        </p>
        <p>DOB: {client.birthdate && format(new Date(client.birthdate), "PP")}</p>
        <p>ID: {client.personalid}</p>
        <p>Email: {client.email}</p>
      </CardContent>
    </Card>
  )
}