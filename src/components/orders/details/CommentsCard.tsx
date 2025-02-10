import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, SendHorizontal, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Database } from "@/integrations/supabase/types"

type Comment = Database["public"]["Tables"]["ordercomments"]["Row"]

interface CommentsCardProps {
  comments: Comment[] | null
  orderId: number
  className?: string
}

export const CommentsCard = ({ comments, orderId, className }: CommentsCardProps) => {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusIcon = (comment: Comment) => {
    const authorLower = comment.author?.toLowerCase() || ""
    if (authorLower.includes("zendesk")) return "🎫"
    if (authorLower.includes("pharmacy")) return "🔬"
    if (authorLower.includes("customer")) return "👤"
    return "💬"
  }

  const handleCommentClick = (comment: Comment) => {
    if (comment.asanataskid) {
      window.open(`https://your-zendesk-domain.zendesk.com/agent/tickets/${comment.asanataskid}`, '_blank')
    }
  }

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3">
        <CardTitle className="text-sm font-medium text-gray-700">
          Comments ({comments?.length || 0})
        </CardTitle>
        <MessageCircle className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-3">
        <ScrollArea className="flex-1 pr-2 mb-3">
          {comments?.length ? (
            <div className="space-y-0">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  onClick={() => handleCommentClick(comment)}
                  className={`relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0 group 
                    ${comment.asanataskid ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                >
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs">
                    {getStatusIcon(comment)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                      <time className="text-xs text-gray-500">
                        {comment.commentdate
                          ? formatDistanceToNow(new Date(comment.commentdate), {
                              addSuffix: true,
                            })
                          : "Unknown date"}
                      </time>
                      {comment.asanataskid && (
                        <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-gray-500">No comments yet</p>
            </div>
          )}
        </ScrollArea>
        
        <div className="relative mt-auto bg-white rounded-md shadow-sm">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="min-h-[60px] max-h-[120px] pr-12 resize-none border-gray-200 focus:border-purple-200 focus:ring-purple-200"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute bottom-2 right-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
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
