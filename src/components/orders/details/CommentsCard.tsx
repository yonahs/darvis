import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Plus, User } from "lucide-react"
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
            variant="outline" 
            size="sm" 
            className="h-8 hover:bg-primary/5 gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Plus className="h-3.5 w-3.5" />
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
              placeholder="Type your message here..."
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
                className="gap-1.5"
              >
                <Send className="h-3 w-3" />
                Send Message
              </Button>
            </div>
          </div>
        )}
        
        <ScrollArea className="flex-1">
          <div className="space-y-4 px-1">
            {comments?.map((comment) => (
              <div
                key={comment.id}
                className="group flex items-start gap-3 hover:bg-muted/30 p-2 -mx-2 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {comment.commentdate && format(new Date(comment.commentdate), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed break-words">
                    {comment.comment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}