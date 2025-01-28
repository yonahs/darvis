import { format } from "date-fns"
import { User } from "lucide-react"
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
        <CardTitle className="text-sm font-medium text-primary/80 flex items-center gap-2">
          <User className="h-4 w-4" />
          Client Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
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