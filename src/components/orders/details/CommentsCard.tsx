import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Plus } from "lucide-react"
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
  const [isExpanded, setIsExpanded] = useState(false)

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
      setIsExpanded(false)
    } catch (error) {
      console.error("Error adding note:", error)
      toast.error("Failed to add note")
    }
  }

  return (
    <Card className="flex flex-col h-full border-none shadow-none bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary/80">
            <MessageSquare className="h-4 w-4" />
            Comments & Service Notes
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 hover:bg-primary/5"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Comment
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full pt-0 space-y-4">
        {isExpanded && (
          <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-lg border border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this order..."
              className="min-h-[100px] resize-none bg-background"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddNote} 
                disabled={!note.trim()}
                size="sm"
                className="gap-1"
              >
                <Send className="h-3 w-3" />
                Send
              </Button>
            </div>
          </div>
        )}
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-border">
            {comments?.map((comment) => (
              <div
                key={comment.id}
                className="relative pl-8 animate-in fade-in duration-200"
              >
                <div className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-primary/20 border-2 border-primary" />
                <div className="bg-card rounded-lg p-3 shadow-sm border border-border/50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-primary/80">{comment.author}</span>
                    <span className="text-muted-foreground">
                      {comment.commentdate && format(new Date(comment.commentdate), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}