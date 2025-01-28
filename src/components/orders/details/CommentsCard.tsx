import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Database } from "@/integrations/supabase/types"

type Comment = Database["public"]["Tables"]["ordercomments"]["Row"]

interface CommentsCardProps {
  comments: Comment[] | null
}

export const CommentsCard = ({ comments }: CommentsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{comment.author}</span>
              <span className="text-muted-foreground">
                {comment.commentdate && format(new Date(comment.commentdate), "PP")}
              </span>
            </div>
            <p className="mt-1 text-sm">{comment.comment}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}