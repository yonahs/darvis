
import { Bell, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const SlackAlertsWidget = () => {
  // This is a mock data - would be replaced with real Slack integration
  const mockAlerts = [
    {
      id: 1,
      message: "New high-priority order #1234",
      timestamp: "2 mins ago",
      channel: "orders-urgent"
    },
    {
      id: 2,
      message: "Stock alert: Product ABC running low",
      timestamp: "10 mins ago",
      channel: "inventory"
    },
    {
      id: 3,
      message: "Customer support needed for order #5678",
      timestamp: "15 mins ago",
      channel: "support"
    }
  ]

  return (
    <Card className="bg-[#FFDEE2]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Slack Alerts
          </div>
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          Coming Soon
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm">{alert.message}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>#{alert.channel}</span>
                  <span>•</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
