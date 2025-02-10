
import { Stethoscope } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface MedicalCardProps {
  client: any
  isEditing: boolean
  editedClient?: any
  onInputChange: (field: string, value: string) => void
}

export function MedicalCard({ client, isEditing, editedClient, onInputChange }: MedicalCardProps) {
  return (
    <Card className="bg-[#F0F8FF]"> {/* Added very light blue background */}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          Medical Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Doctor</p>
          {isEditing ? (
            <Input
              value={editedClient?.doctor || ""}
              onChange={(e) => onInputChange("doctor", e.target.value)}
            />
          ) : (
            <p>{client.doctor || "N/A"}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Doctor's Phone</p>
          {isEditing ? (
            <Input
              value={editedClient?.drphone || ""}
              onChange={(e) => onInputChange("drphone", e.target.value)}
            />
          ) : (
            <p>{client.drphone || "N/A"}</p>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p>{client.active ? "Active" : "Inactive"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
