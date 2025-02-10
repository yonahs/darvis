
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessagesSquare } from "lucide-react"

export const TeamActivityWidget = () => {
  return (
    <Card className="bg-cyan-500/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4" />
            Team Activity
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm">
            <span className="font-medium">John</span>
            <span className="text-muted-foreground"> updated Order #1234</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Sarah</span>
            <span className="text-muted-foreground"> added shipping details</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
