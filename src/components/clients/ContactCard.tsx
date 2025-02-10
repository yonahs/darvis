
import { Mail, Phone, Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ContactCardProps {
  client: any
  isEditing: boolean
  editedClient?: any
  onInputChange: (field: string, value: string) => void
}

export function ContactCard({ client, isEditing, editedClient, onInputChange }: ContactCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          {isEditing ? (
            <Input
              value={editedClient?.email || ""}
              onChange={(e) => onInputChange("email", e.target.value)}
            />
          ) : (
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {client.email}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                placeholder="Mobile"
                value={editedClient?.mobile || ""}
                onChange={(e) => onInputChange("mobile", e.target.value)}
              />
              <Input
                placeholder="Day Phone"
                value={editedClient?.dayphone || ""}
                onChange={(e) => onInputChange("dayphone", e.target.value)}
              />
            </div>
          ) : (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {client.mobile || client.dayphone || "N/A"}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedClient?.address || ""}
                onChange={(e) => onInputChange("address", e.target.value)}
              />
              <Input
                value={editedClient?.city || ""}
                onChange={(e) => onInputChange("city", e.target.value)}
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={editedClient?.state || ""}
                  onChange={(e) => onInputChange("state", e.target.value)}
                />
                <Input
                  value={editedClient?.zip || ""}
                  onChange={(e) => onInputChange("zip", e.target.value)}
                />
                <Input
                  value={editedClient?.country || ""}
                  onChange={(e) => onInputChange("country", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <Home className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p>{client.address}</p>
                <p>{client.city}, {client.state} {client.zip}</p>
                <p>{client.country}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
