import { Users, Clock, AlertCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Database } from "@/integrations/supabase/types"

type Comment = Database["public"]["Tables"]["ordercomments"]["Row"]

interface OrderTimelineProps {
  orderId: number
  comments: Comment[] | null
}

export const OrderTimeline = ({ orderId, comments }: OrderTimelineProps) => {
  const getStatusIcon = (comment: Comment) => {
    const authorLower = comment.author?.toLowerCase() || ""
    if (authorLower.includes("pharmacy")) return "🔬"
    if (authorLower.includes("customer")) return "👤"
    return "📦"
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {comments?.map((comment) => (
          <div
            key={comment.id}
            className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
          >
            <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs">
              {getStatusIcon(comment)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{comment.author}</span>
                <span>•</span>
                <span>{new Date(comment.commentdate || "").toLocaleString()}</span>
              </div>
              <p className="text-sm">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-4">
        <Button variant="outline" size="sm" className="gap-2">
          <Send className="h-4 w-4" />
          Send Notification
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Assign Team Member
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4" />
          Set Delay Date
        </Button>
        <Button variant="destructive" size="sm" className="gap-2">
          <AlertCircle className="h-4 w-4" />
          Escalate Issue
        </Button>
      </div>
    </div>
  )
}