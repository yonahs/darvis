import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, SendHorizontal, UserRound } from "lucide-react"
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="h-full flex flex-col bg-[#F8F9FA]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3">
        <CardTitle className="text-sm font-medium text-gray-700">
          Comments ({comments?.length || 0})
        </CardTitle>
        <MessageCircle className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-3">
        <ScrollArea className="flex-1 pr-2 mb-3">
          {comments?.length ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="flex space-x-2 group hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                  <Avatar className="h-8 w-8 bg-[#E5DEFF]">
                    <AvatarFallback className="text-xs font-medium text-[#6B46C1]">
                      {getInitials(comment.author || 'CS')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{comment.author}</p>
                      <time className="text-xs text-gray-500">
                        {comment.commentdate
                          ? formatDistanceToNow(new Date(comment.commentdate), {
                              addSuffix: true,
                            })
                          : "Unknown date"}
                      </time>
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