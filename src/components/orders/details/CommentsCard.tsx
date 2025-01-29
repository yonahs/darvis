import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Database } from "@/integrations/supabase/types"

type Comment = Database["public"]["Tables"]["ordercomments"]["Row"]

interface CommentsCardProps {
  comments: Comment[] | null
}

export const CommentsCard = ({ comments }: CommentsCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Comments ({comments?.length || 0})
        </CardTitle>
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          {comments?.length ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{comment.author}</p>
                    <time className="text-xs text-muted-foreground">
                      {comment.commentdate
                        ? formatDistanceToNow(new Date(comment.commentdate), {
                            addSuffix: true,
                          })
                        : "Unknown date"}
                    </time>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No comments yet
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}