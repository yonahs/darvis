import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Database } from "@/integrations/supabase/types"

type Comment = Database["public"]["Tables"]["ordercomments"]["Row"]

interface CommentsCardProps {
  comments: Comment[] | null
  orderId: number
}

export const CommentsCard = ({ comments, orderId }: CommentsCardProps) => {
  const [note, setNote] = useState("")

  const handleAddNote = async () => {
    if (!note.trim()) return

    try {
      const { error } = await supabase
        .from("ordercomments")
        .insert({
          id: Date.now(),
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

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-primary/80 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Comments & Service Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full space-y-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {comments?.map((comment) => (
              <div
                key={comment.id}
                className={`flex ${
                  comment.author === "Customer Service" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    comment.author === "Customer Service"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{comment.author}</span>
                    <span className="opacity-70">
                      {comment.commentdate && format(new Date(comment.commentdate), "PP p")}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2 pt-4 border-t">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this order..."
            className="min-h-[80px] resize-none"
          />
          <Button 
            onClick={handleAddNote} 
            disabled={!note.trim()}
            className="self-end"
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}