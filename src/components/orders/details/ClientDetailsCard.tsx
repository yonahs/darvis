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
    <Card className="h-full">
      <CardHeader className="p-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium text-primary/80 flex items-center gap-1">
            <User className="h-3 w-3" />
            Client Details
          </CardTitle>
          <Button
            variant="outline"
            size="xs"
            onClick={handleChangeDetails}
            className="h-6 px-2 text-xs gap-1"
          >
            <Pencil className="h-3 w-3" />
            Change Details
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-0.5 text-xs p-2">
        <p className="font-medium">
          {client.firstname} {client.lastname}
        </p>
        <p className="text-muted-foreground">DOB: {client.birthdate && format(new Date(client.birthdate), "PP")}</p>
        <p className="text-muted-foreground">ID: {client.personalid}</p>
        <p className="text-muted-foreground">Email: {client.email}</p>
      </CardContent>
    </Card>
  )
}