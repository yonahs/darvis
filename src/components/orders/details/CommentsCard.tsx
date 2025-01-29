import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, SendHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import type { Database } from "@/integrations/supabase/types"

type Comment = Database["public"]["Tables"]["ordercomments"]["Row"]

interface CommentsCardProps {
  comments: Comment[] | null
  orderId: number
}

export const CommentsCard = ({ comments, orderId }: CommentsCardProps) => {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      // First, get the maximum ID to ensure we don't have conflicts
      const { data: maxIdResult, error: maxIdError } = await supabase
        .from("ordercomments")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single()

      if (maxIdError) throw maxIdError

      const newId = (maxIdResult?.id || 0) + 1

      const { error } = await supabase
        .from("ordercomments")
        .insert({
          id: newId,
          orderid: orderId,
          comment: newComment.trim(),
          author: "Customer Service", // This could be dynamic based on user role
          commentdate: new Date().toISOString(),
          showonreadyshipping: false,
          deleteable: true
        })

      if (error) throw error

      setNewComment("")
      toast.success("Comment added successfully")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Comments ({comments?.length || 0})
        </CardTitle>
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4 mb-4">
          {comments?.length ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="flex flex-col space-y-1 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary">{comment.author}</p>
                    <time className="text-xs text-muted-foreground">
                      {comment.commentdate
                        ? formatDistanceToNow(new Date(comment.commentdate), {
                            addSuffix: true,
                          })
                        : "Unknown date"}
                    </time>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{comment.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No comments yet
            </p>
          )}
        </ScrollArea>
        
        <div className="relative mt-auto">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="min-h-[80px] pr-12 resize-none"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-2 right-2"
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}