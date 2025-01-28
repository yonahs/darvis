import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface ServiceNotesProps {
  orderId: number
}

export const ServiceNotes = ({ orderId }: ServiceNotesProps) => {
  const [note, setNote] = useState("")

  const handleAddNote = async () => {
    if (!note.trim()) return

    try {
      const { error } = await supabase
        .from("ordercomments")
        .insert({
          orderid: orderId,
          comment: note,
          author: "Customer Service",
          commentdate: new Date().toISOString(),
        })

      if (error) throw error

      toast.success("Note added successfully")
      setNote("")
    } catch (error) {
      console.error("Error adding note:", error)
      toast.error("Failed to add note")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <h3 className="font-medium">Add Service Note</h3>
      </div>
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note about this order..."
        className="min-h-[100px]"
      />
      <Button onClick={handleAddNote} disabled={!note.trim()}>
        Add Note
      </Button>
    </div>
  )
}