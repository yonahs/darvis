
import { Button } from "@/components/ui/button"

interface ClientEditActionsProps {
  isEditing: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  isPending: boolean
}

export function ClientEditActions({ 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  isPending 
}: ClientEditActionsProps) {
  if (!isEditing) {
    return <Button onClick={onEdit}>Edit Information</Button>
  }

  return (
    <div className="space-x-2">
      <Button onClick={onSave} disabled={isPending}>
        Save Changes
      </Button>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )
}
