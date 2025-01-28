import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ShieldCheck } from "lucide-react"
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
          id: Date.now(), // Generate a temporary ID
          orderid: orderId,
          comment: note,
          author: "Customer Service",
          commentdate: new Date().toISOString(),
          deleteable: true,
          showonreadyshipping: false
        })

      if (error) throw error

      toast.success("Note added successfully")
      setNote("")
    } catch (error) {
      console.error("Error adding note:", error)
      toast.error("Failed to add note")
    }
  }

  const handleDeescalate = async () => {
    try {
      // Add a comment about de-escalation
      const { error: commentError } = await supabase
        .from("ordercomments")
        .insert({
          id: Date.now(),
          orderid: orderId,
          comment: "Order has been de-escalated",
          author: "Customer Service",
          commentdate: new Date().toISOString(),
          deleteable: true,
          showonreadyshipping: false
        })

      if (commentError) throw commentError

      toast.success("Order has been de-escalated")
    } catch (error) {
      console.error("Error de-escalating order:", error)
      toast.error("Failed to de-escalate order")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <h3 className="font-medium">Add Service Note</h3>
        </div>
        <Button
          onClick={handleDeescalate}
          variant="outline"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <ShieldCheck className="h-4 w-4 mr-2" />
          De-escalate Order
        </Button>
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