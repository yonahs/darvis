import { format } from "date-fns"
import { User, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Database } from "@/integrations/supabase/types"

type Client = Database["public"]["Tables"]["clients"]["Row"]

interface ClientDetailsProps {
  client: Client | null
}

export const ClientDetailsCard = ({ client }: ClientDetailsProps) => {
  if (!client) return null

  const handleChangeDetails = () => {
    console.log("Change details clicked for client:", client.clientid)
    // TODO: Implement change details functionality
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-primary/80 flex items-center gap-2">
            <User className="h-4 w-4" />
            Client Details
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleChangeDetails}
            className="gap-2"
          >
            <Pencil className="h-4 w-4" />
            Change Details
          </Button>
        </div>
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